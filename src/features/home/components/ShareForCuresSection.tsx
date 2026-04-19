import { Link } from 'react-router'
import qgLogo from '@/assets/icons/qg_batimat.png'

export default function ShareForCuresSection() {
  return (
    <section className="bg-[#cc4a17] py-12 text-white px-4 md:px-8 lg:px-12 mt-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-8 lg:flex-row">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <img
                src={qgLogo}
                alt="Logo QG Batimat"
                width={80}
                height={80}
                className="rounded-md bg-white p-1"
              />
              <p className="relative inline-block text-3xl md:text-4xl font-bold overflow-hidden">
                <span className="shine-effect">QG Batimat</span>
              </p>
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h2 className="mb-4 text-2xl font-bold lg:text-3xl text-white">
              Ensemble, nous aidons les professionnels du BTP a construire plus vite et mieux.
            </h2>
            <p className="mb-6 text-lg text-white/95 leading-relaxed">
              QG Batimat accompagne artisans, entreprises et particuliers avec un catalogue complet
              de materiaux, quincaillerie, plomberie, electricite et outillage. Notre engagement:
              des produits fiables, des prix transparents et une logistique adaptee aux realites des
              chantiers au Togo.
            </p>
            <Link
              to="/produits"
              className="inline-block rounded-full border border-white bg-transparent px-6 py-3 font-bold text-white hover:bg-[#e8541a] hover:text-white transition-colors"
            >
              Decouvrir notre catalogue
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
