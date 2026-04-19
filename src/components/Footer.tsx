import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faXTwitter, faInstagram, faYoutube, faTiktok, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'

const socials = [
  { icon: faFacebookF, url: 'https://facebook.com', name: 'Facebook' },
  { icon: faXTwitter, url: 'https://x.com', name: 'X' },
  { icon: faInstagram, url: 'https://instagram.com', name: 'Instagram' },
  { icon: faYoutube, url: 'https://youtube.com', name: 'YouTube' },
  { icon: faTiktok, url: 'https://tiktok.com', name: 'TikTok' },
  { icon: faLinkedinIn, url: 'https://linkedin.com', name: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="border-b border-white/15">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/90 font-medium">Un projet chantier en cours ?</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/produits"
              className="inline-flex items-center rounded-full border border-white/60 px-5 py-2 text-sm font-semibold text-white hover:bg-white hover:text-[#1e2a6e] transition-colors"
            >
              Voir le catalogue
            </Link>
            <Link
              to="/produits?badge=promo"
              className="inline-flex items-center rounded-full bg-[#e8541a] px-5 py-2 text-sm font-semibold text-white hover:bg-[#d14b18] transition-colors"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 rounded-full border border-white/25 text-xs font-semibold text-white/90">Materiaux certifies</span>
            <span className="px-3 py-1 rounded-full border border-white/25 text-xs font-semibold text-white/90">Livraison rapide</span>
            <span className="px-3 py-1 rounded-full border border-white/25 text-xs font-semibold text-white/90">Support pro</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-900 hover:bg-[#e8541a] hover:text-white transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Lien ${social.name}`}
              >
                <FontAwesomeIcon icon={social.icon} className="text-base" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white mb-4">Navigation</h3>
          <ul className="space-y-2.5 text-sm text-white/85">
            <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
            <li><Link to="/produits" className="hover:text-white transition-colors">Tous les produits</Link></li>
            <li><Link to="/produits?badge=promo" className="hover:text-white transition-colors">Promotions</Link></li>
            <li><Link to="/produits?badge=nouveau" className="hover:text-white transition-colors">Nouveautes</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white mb-4">Services</h3>
          <ul className="space-y-2.5 text-sm text-white/85">
            <li><a href="#" className="hover:text-white transition-colors">Conseil chantier</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Suivi de commande</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Livraison & retours</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Conditions generales</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white mb-4">Contact</h3>
          <ul className="space-y-3 text-sm text-white/90">
            <li>
              <a href="tel:+22890000000" className="hover:text-white transition-colors">+228 90 00 00 00</a>
            </li>
            <li>
              <a href="mailto:contact@qgbatimat.tg" className="hover:text-white transition-colors">contact@qgbatimat.tg</a>
            </li>
            <li>Lome, Togo</li>
          </ul>
          <Link
            to="/produits"
            className="mt-5 inline-flex rounded-full border border-white/55 px-5 py-2 text-sm font-semibold hover:bg-white hover:text-[#1e2a6e] transition-colors"
          >
            Parler a un conseiller
          </Link>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/80">
          <span>QG Batimat © 2026. Tous droits reserves.</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['Paiement securise', 'Devis express', 'Support 6j/7'].map((item) => (
              <span key={item} className="px-3 py-1 rounded-full border border-white/25 text-[11px] font-semibold text-white/90">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
