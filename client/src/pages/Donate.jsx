import { useEffect, useState } from 'react';

import Reveal from '../components/motion/Reveal.jsx';
import Stagger from '../components/motion/Stagger.jsx';
import { apiRequest } from '../config.js';
import { siteCopy } from '../content/siteCopy.js';

const DEFAULT_QR_URLS = ['/assets/donate/gpay-upi-qr.png'];
const DEFAULT_UPI_LABEL = 'UPI ID: khushwant.ahluwalia-1@oksbi';

const Donate = () => {
  const copy = siteCopy.donate;
  const [settings, setSettings] = useState({
    donationBankDetails: '',
    donationQrImageUrls: [],
    externalDonateUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const qrUrls = settings.donationQrImageUrls.length === 0 ? DEFAULT_QR_URLS : settings.donationQrImageUrls;

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await apiRequest('/settings');

        if (!mounted) {
          return;
        }

        setSettings((prev) => ({ ...prev, ...(response.data || {}) }));
      } catch (_loadError) {
        if (!mounted) {
          return;
        }

        setError(copy.loadError);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, [copy.loadError]);

  return (
    <div className="page page-premium">
      <section className="section section--tight donate-hero">
        <div className="container-wide">
          <Reveal>
            <p className="kicker">{copy.kicker}</p>
            <h1 className="headline-lg">{copy.title}</h1>
            <p className="lead">{copy.description}</p>
            {settings.externalDonateUrl ? (
              <a className="pill-btn btn-primary" href={settings.externalDonateUrl} target="_blank" rel="noreferrer">
                {copy.donateNowLabel}
              </a>
            ) : (
              <button type="button" className="pill-btn btn-primary" disabled>
                {copy.donatePendingLabel}
              </button>
            )}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          {loading && <p className="muted-text">{copy.loading}</p>}
          {!loading && error && <p className="status error">{error}</p>}

          {!loading && !error && (
            <Stagger className="content-grid content-grid--two">
              <article className="card">
                <h2>{copy.bankDetailsHeading}</h2>
                <p style={{ whiteSpace: 'pre-wrap' }}>
                  {settings.donationBankDetails || copy.bankDetailsFallback}
                </p>
              </article>

              <article className="card">
                <h2>{copy.qrHeading}</h2>
                {qrUrls.length === 0 ? (
                  <p className="muted-text">{copy.qrFallback}</p>
                ) : (
                  <div className="qr-grid">
                    {qrUrls.map((url) => (
                      <img key={url} src={url} alt="Donation QR code" loading="lazy" />
                    ))}
                  </div>
                )}
                <p className="meta donate-upi-label">{DEFAULT_UPI_LABEL}</p>
              </article>
            </Stagger>
          )}
        </div>
      </section>
    </div>
  );
};

export default Donate;
