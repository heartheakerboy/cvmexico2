import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/lib/settings";

export const Route = createFileRoute("/reembolso")({
  head: () => ({
    meta: [
      { title: "Política de Reembolso | CVAI" },
      { name: "description", content: "Política de no reembolso para las suscripciones Pro y servicios premium en CVAI." },
      { property: "og:url", content: "/reembolso" },
    ],
    links: [{ rel: "canonical", href: "/reembolso" }],
  }),
  component: ReembolsoComponent,
});

function ReembolsoComponent() {
  const { t } = useSettings();

  return (
    <PageShell title="Política de reembolso" subtitle="Información sobre compras, suscripciones y devoluciones">
      <div className="mx-auto max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-foreground">1. Política General de No Reembolso</h2>
          <p>
            En CVAI, nos esforzamos por ofrecer un constructor de currículums de la más alta calidad impulsado por inteligencia artificial. Debido a la naturaleza digital e inmediata del servicio Pro, <strong>todas las ventas son finales y no se ofrecen reembolsos bajo ninguna circunstancia.</strong>
          </p>
          <p>
            Al comprar una suscripción Pro (mensual o anual) o un paquete premium, obtienes acceso inmediato a nuestras funciones inteligentes, descargas ilimitadas, simuladores y recursos que se consumen de manera instantánea. Por esta razón, no podemos revertir las transacciones ni procesar devoluciones una vez que se ha otorgado el acceso.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-foreground">2. Cancelaciones de Suscripción</h2>
          <p>
            Puedes cancelar tu suscripción premium en cualquier momento directamente desde tu panel de usuario en la sección de <strong>"Mi Cuenta"</strong>. 
          </p>
          <p>
            La cancelación evitará de forma automática el cobro del próximo ciclo de facturación (ya sea mensual o anual). Al cancelar, continuarás disfrutando de los beneficios del plan Pro hasta el final del periodo de facturación actual que ya has pagado. Transcurrido ese plazo, tu cuenta se convertirá automáticamente al plan gratuito ("Free") y no se realizarán nuevos cobros.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-foreground">3. Cargos Recurrentes e Impuestos</h2>
          <p>
            Las suscripciones Pro se renuevan de forma automática cada mes o año (según el intervalo elegido al momento de la contratación) utilizando el método de pago registrado a través de nuestro procesador de pagos LemonSqueezy. Es responsabilidad exclusiva del usuario cancelar la suscripción antes de la fecha de renovación si no desea continuar con el servicio.
          </p>
          <p>
            No se realizarán reembolsos prorrateados ni devoluciones por periodos de facturación parciales o suscripciones no utilizadas durante el ciclo activo.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-foreground">4. Modificaciones del Servicio</h2>
          <p>
            CVAI se reserva el derecho de modificar sus precios, planes, funciones disponibles y los términos de esta política de reembolso en cualquier momento, publicando los cambios actualizados en nuestra página de precios y en este sitio web.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-foreground">5. Contacto de Soporte</h2>
          <p>
            Si tienes algún problema técnico con el procesamiento de tu pago, problemas para acceder a las funciones premium o dudas de facturación, por favor ponte en contacto con nuestro equipo de soporte técnico a través del formulario de contacto o enviando un correo directamente a soporte.
          </p>
          <p className="text-xs text-muted-foreground pt-4 border-t">
            Última actualización: 13 de Julio de 2026. Conforme a las leyes de protección al consumidor aplicables al comercio electrónico en México.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
