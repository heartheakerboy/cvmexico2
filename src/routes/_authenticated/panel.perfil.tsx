import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  User, Loader2, Save, Plus, Trash2, Upload, Camera,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { getUploadUrl, confirmUpload, deleteFile, getSignedDownloadUrl } from "@/lib/storage.functions";
import { useServerFn } from "@tanstack/react-start";

function resizeProfileImage(file: File, max: number = 400): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error("Compression failed"));
        }, "image/jpeg", 0.85);
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/panel/perfil")({
  component: PerfilPage,
});

type LangItem = { name: string; level: string };
type CertItem = { name: string; issuer: string; year: string };
type EduItem = { school: string; degree: string; start: string; end: string };
type ExpItem = { company: string; role: string; start: string; end: string; description: string };
type RefItem = { name: string; relation: string; contact: string };

type ProfileForm = {
  full_name: string;
  headline: string;
  phone: string;
  email: string;
  address: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  skills: string[];
  languages: LangItem[];
  certificates: CertItem[];
  education: EduItem[];
  experience: ExpItem[];
  references_list: RefItem[];
};

const empty: ProfileForm = {
  full_name: "", headline: "", phone: "", email: "", address: "",
  linkedin: "", portfolio: "", summary: "", skills: [],
  languages: [], certificates: [], education: [], experience: [], references_list: [],
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="font-display text-base font-semibold">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function PerfilPage() {
  const getUploadUrlFn = useServerFn(getUploadUrl);
  const confirmUploadFn = useServerFn(confirmUpload);
  const deleteFileFn = useServerFn(deleteFile);
  const getSignedDownloadUrlFn = useServerFn(getSignedDownloadUrl);

  const [form, setForm] = useState<ProfileForm>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ProfileForm>(k: K, v: ProfileForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function load() {
    const { data: userRes } = await supabase.auth.getUser();
    const id = userRes.user?.id ?? null;
    setUid(id);
    if (!id) return setLoading(false);
    const { data } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
    if (data) {
      setForm({
        full_name: data.full_name ?? "",
        headline: data.headline ?? "",
        phone: data.phone ?? "",
        email: data.email ?? userRes.user?.email ?? "",
        address: data.address ?? "",
        linkedin: data.linkedin ?? "",
        portfolio: data.portfolio ?? "",
        summary: data.summary ?? "",
        skills: (data.skills as string[]) ?? [],
        languages: (data.languages as LangItem[]) ?? [],
        certificates: (data.certificates as CertItem[]) ?? [],
        education: (data.education as EduItem[]) ?? [],
        experience: (data.experience as ExpItem[]) ?? [],
        references_list: (data.references_list as RefItem[]) ?? [],
      });
      if (data.avatar_url) {
        setAvatarPath(data.avatar_url);
        const signed = await getSignedDownloadUrlFn({ data: { storagePath: data.avatar_url } });
        if (signed?.signedUrl) setAvatarUrl(signed.signedUrl);
      }
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function onPickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !uid) return;
    
    setSaving(true);
    try {
      const compressedBlob = await resizeProfileImage(file, 400);
      const ext = file.name.split(".").pop() || "jpg";
      const folder = `users/${uid}/photos`;

      const { uploadUrl, storagePath: r2Path, fileId } = await getUploadUrlFn({
        data: {
          fileName: `avatar-${Date.now()}.${ext}`,
          fileType: "image/jpeg",
          fileSize: compressedBlob.size,
          isPublic: true,
          folder,
        }
      });

      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: compressedBlob,
        headers: {
          "Content-Type": "image/jpeg",
        },
      });

      if (!response.ok) throw new Error("Upload failed");

      await confirmUploadFn({ data: { fileId, fileSize: compressedBlob.size } });

      if (avatarPath) {
        try {
          await deleteFileFn({ data: { storagePath: avatarPath } });
        } catch (err) {
          console.error("Failed to delete old avatar:", err);
        }
      }

      setAvatarPath(r2Path);
      const signed = await getSignedDownloadUrlFn({ data: { storagePath: r2Path } });
      if (signed?.signedUrl) setAvatarUrl(signed.signedUrl);
      await supabase.from("profiles").update({ avatar_url: r2Path }).eq("id", uid);
      toast.success("Foto actualizada");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo subir la foto");
    } finally {
      setSaving(false);
    }
  }

  async function save() {
    if (!uid) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name || null,
      headline: form.headline || null,
      phone: form.phone || null,
      email: form.email || null,
      address: form.address || null,
      linkedin: form.linkedin || null,
      portfolio: form.portfolio || null,
      summary: form.summary || null,
      skills: form.skills,
      languages: form.languages,
      certificates: form.certificates,
      education: form.education,
      experience: form.experience,
      references_list: form.references_list,
    }).eq("id", uid);
    setSaving(false);
    if (error) return toast.error("No se pudo guardar");
    toast.success("Perfil guardado");
  }

  function addSkill() {
    const v = skillInput.trim();
    if (!v) return;
    if (!form.skills.includes(v)) set("skills", [...form.skills, v]);
    setSkillInput("");
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold">Mi perfil</h1>
            <p className="text-sm text-muted-foreground">Tu información base para todos tus CV.</p>
          </div>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar
        </Button>
      </div>

      {/* Foto + básicos */}
      <Section title="Datos personales">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Foto" className="h-full w-full object-cover" />
              ) : (
                <Camera className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickPhoto} />
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Subir foto
            </Button>
            <p className="mt-1.5 text-xs text-muted-foreground">JPG o PNG, hasta 5 MB.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre completo" value={form.full_name} onChange={(v) => set("full_name", v)} />
          <Field label="Titular profesional" value={form.headline} onChange={(v) => set("headline", v)} placeholder="Ej. Desarrollador Frontend" />
          <Field label="Teléfono" value={form.phone} onChange={(v) => set("phone", v)} />
          <Field label="Correo" type="email" value={form.email} onChange={(v) => set("email", v)} />
          <Field label="Dirección" value={form.address} onChange={(v) => set("address", v)} />
          <Field label="LinkedIn" value={form.linkedin} onChange={(v) => set("linkedin", v)} />
          <Field label="Portafolio" value={form.portfolio} onChange={(v) => set("portfolio", v)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Resumen profesional</Label>
          <Textarea rows={3} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
        </div>
      </Section>

      {/* Habilidades */}
      <Section title="Habilidades">
        <div className="flex gap-2">
          <Input value={skillInput} placeholder="Agregar habilidad" onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} />
          <Button variant="outline" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              {s}
              <button onClick={() => set("skills", form.skills.filter((x) => x !== s))}>
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
          {form.skills.length === 0 && <p className="text-sm text-muted-foreground">Sin habilidades aún.</p>}
        </div>
      </Section>

      {/* Idiomas */}
      <Section title="Idiomas">
        {form.languages.map((it, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <Input placeholder="Idioma" value={it.name} onChange={(e) => set("languages", form.languages.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
            <Input placeholder="Nivel (Ej. Avanzado)" value={it.level} onChange={(e) => set("languages", form.languages.map((x, j) => j === i ? { ...x, level: e.target.value } : x))} />
            <Button variant="ghost" size="icon" onClick={() => set("languages", form.languages.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => set("languages", [...form.languages, { name: "", level: "" }])}><Plus className="h-4 w-4" /> Agregar idioma</Button>
      </Section>

      {/* Certificados */}
      <Section title="Certificados">
        {form.certificates.map((it, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_120px_auto]">
            <Input placeholder="Nombre" value={it.name} onChange={(e) => set("certificates", form.certificates.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
            <Input placeholder="Institución" value={it.issuer} onChange={(e) => set("certificates", form.certificates.map((x, j) => j === i ? { ...x, issuer: e.target.value } : x))} />
            <Input placeholder="Año" value={it.year} onChange={(e) => set("certificates", form.certificates.map((x, j) => j === i ? { ...x, year: e.target.value } : x))} />
            <Button variant="ghost" size="icon" onClick={() => set("certificates", form.certificates.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => set("certificates", [...form.certificates, { name: "", issuer: "", year: "" }])}><Plus className="h-4 w-4" /> Agregar certificado</Button>
      </Section>

      {/* Educación */}
      <Section title="Educación">
        {form.education.map((it, i) => (
          <div key={i} className="space-y-2 rounded-xl border border-border p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <Input placeholder="Institución" value={it.school} onChange={(e) => set("education", form.education.map((x, j) => j === i ? { ...x, school: e.target.value } : x))} />
              <Input placeholder="Título / carrera" value={it.degree} onChange={(e) => set("education", form.education.map((x, j) => j === i ? { ...x, degree: e.target.value } : x))} />
              <Input placeholder="Inicio (Ej. 2018)" value={it.start} onChange={(e) => set("education", form.education.map((x, j) => j === i ? { ...x, start: e.target.value } : x))} />
              <Input placeholder="Fin (Ej. 2022)" value={it.end} onChange={(e) => set("education", form.education.map((x, j) => j === i ? { ...x, end: e.target.value } : x))} />
            </div>
            <Button variant="ghost" size="sm" onClick={() => set("education", form.education.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /> Quitar</Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => set("education", [...form.education, { school: "", degree: "", start: "", end: "" }])}><Plus className="h-4 w-4" /> Agregar educación</Button>
      </Section>

      {/* Experiencia */}
      <Section title="Experiencia">
        {form.experience.map((it, i) => (
          <div key={i} className="space-y-2 rounded-xl border border-border p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <Input placeholder="Empresa" value={it.company} onChange={(e) => set("experience", form.experience.map((x, j) => j === i ? { ...x, company: e.target.value } : x))} />
              <Input placeholder="Puesto" value={it.role} onChange={(e) => set("experience", form.experience.map((x, j) => j === i ? { ...x, role: e.target.value } : x))} />
              <Input placeholder="Inicio" value={it.start} onChange={(e) => set("experience", form.experience.map((x, j) => j === i ? { ...x, start: e.target.value } : x))} />
              <Input placeholder="Fin" value={it.end} onChange={(e) => set("experience", form.experience.map((x, j) => j === i ? { ...x, end: e.target.value } : x))} />
            </div>
            <Textarea rows={2} placeholder="Descripción / logros" value={it.description} onChange={(e) => set("experience", form.experience.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} />
            <Button variant="ghost" size="sm" onClick={() => set("experience", form.experience.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /> Quitar</Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => set("experience", [...form.experience, { company: "", role: "", start: "", end: "", description: "" }])}><Plus className="h-4 w-4" /> Agregar experiencia</Button>
      </Section>

      {/* Referencias */}
      <Section title="Referencias">
        {form.references_list.map((it, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <Input placeholder="Nombre" value={it.name} onChange={(e) => set("references_list", form.references_list.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
            <Input placeholder="Relación" value={it.relation} onChange={(e) => set("references_list", form.references_list.map((x, j) => j === i ? { ...x, relation: e.target.value } : x))} />
            <Input placeholder="Contacto" value={it.contact} onChange={(e) => set("references_list", form.references_list.map((x, j) => j === i ? { ...x, contact: e.target.value } : x))} />
            <Button variant="ghost" size="icon" onClick={() => set("references_list", form.references_list.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => set("references_list", [...form.references_list, { name: "", relation: "", contact: "" }])}><Plus className="h-4 w-4" /> Agregar referencia</Button>
      </Section>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar perfil
        </Button>
      </div>
    </div>
  );
}
