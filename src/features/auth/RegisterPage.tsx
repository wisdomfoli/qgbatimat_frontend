import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from './services/auth-service';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(formData);
      navigate('/');
      window.location.reload();
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0] as string[];
        setError(firstError[0]);
      } else {
        setError(err.response?.data?.message || 'Erreur réseau ou serveur. Vérifiez que le backend est lancé.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-zinc-900">
          Créer un compte
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-zinc-900">
              Nom complet
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6 px-3"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-zinc-900">
              Adresse e-mail
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6 px-3"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-zinc-900">
              Mot de passe
            </label>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 pr-10 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6 px-3"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-600"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium leading-6 text-zinc-900">
              Confirmer le mot de passe
            </label>
            <div className="mt-2 relative">
              <input
                id="password_confirmation"
                name="password_confirmation"
                type={showPasswordConfirm ? 'text' : 'password'}
                required
                value={formData.password_confirmation}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 pr-10 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6 px-3"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-600"
                aria-label={showPasswordConfirm ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPasswordConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 disabled:opacity-50"
            >
              {loading ? 'Création en cours...' : "S'inscrire"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-zinc-500">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-semibold leading-6 text-zinc-900 hover:text-zinc-700">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
