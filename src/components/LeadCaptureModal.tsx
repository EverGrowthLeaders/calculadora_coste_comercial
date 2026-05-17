import { useState } from 'react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ──────────────────────────────────────────────────────────
    // TODO: Connect to your CRM, webhook, or email tool.
    // Example integrations:
    //   - fetch('https://hooks.zapier.com/...', { method: 'POST', body: JSON.stringify(formData) })
    //   - HubSpot API, ActiveCampaign, Brevo, etc.
    // ──────────────────────────────────────────────────────────
    console.log('[LeadCapture] Form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-navy-50 text-text-muted hover:text-text-primary transition-smooth"
          aria-label="Cerrar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!submitted ? (
          <>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Descargar tu diagnóstico
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              Te enviamos el resumen con los datos de tu estimación y las recomendaciones personalizadas.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="lead-name" className="block text-sm font-medium text-text-primary mb-1">
                  Nombre *
                </label>
                <input
                  id="lead-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white border border-navy-100 rounded-xl text-text-primary
                             focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500
                             transition-smooth placeholder:text-text-muted"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="lead-email" className="block text-sm font-medium text-text-primary mb-1">
                  Email *
                </label>
                <input
                  id="lead-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white border border-navy-100 rounded-xl text-text-primary
                             focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500
                             transition-smooth placeholder:text-text-muted"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="lead-company" className="block text-sm font-medium text-text-primary mb-1">
                  Empresa *
                </label>
                <input
                  id="lead-company"
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white border border-navy-100 rounded-xl text-text-primary
                             focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500
                             transition-smooth placeholder:text-text-muted"
                  placeholder="Nombre de tu empresa"
                />
              </div>

              <div>
                <label htmlFor="lead-phone" className="block text-sm font-medium text-text-primary mb-1">
                  Teléfono <span className="text-text-muted font-normal">(opcional)</span>
                </label>
                <input
                  id="lead-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white border border-navy-100 rounded-xl text-text-primary
                             focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500
                             transition-smooth placeholder:text-text-muted"
                  placeholder="+34 600 000 000"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-navy-700 to-navy-800 text-white font-semibold rounded-xl
                           hover:from-navy-600 hover:to-navy-700 transition-smooth
                           shadow-lg shadow-navy-700/20 hover:shadow-xl hover:shadow-navy-700/30
                           active:scale-[0.98]"
              >
                Enviar diagnóstico
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 animate-scale-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">¡Recibido!</h3>
            <p className="text-sm text-text-secondary mb-6">
              En breve recibirás tu diagnóstico personalizado en el email indicado.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-navy-600 hover:text-navy-800 hover:bg-navy-50 rounded-xl transition-smooth"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
