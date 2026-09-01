import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import LoginIllustration from '../../assets/auth/svg_login.svg'
import AuthForm from '../../components/ui/AuthForm'
import Input from '../../components/ui/Input'
import { toast } from 'sonner'
import { useProviderSignup } from '../../hooks/useAuth.ts'
import { useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'

const PROVIDER_CATEGORIES = [
  "ITEMS",
  "VENUE",
  "RIDES",
  "PROPERTY",
  "SERVICE",
  "OTHERS"
];

const ProviderSignup = () => {
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [serviceRadius, setServiceRadius] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  
  const [error, setError] = useState('')
  const { mutateAsync: signup, isPending } = useProviderSignup()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialCharacter = /[!@#$%^&*()]/.test(password);

  const isValidPassword = hasMinLength && hasUppercase && hasNumber && hasSpecialCharacter;

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
        setCategories(categories.filter(c => c !== cat))
    } else {
        setCategories([...categories, cat])
    }
  }

  const handleNextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setError('')
    if (!fullName || !username || !email || !password) {
        setError('Please fill in all fields in step 1')
        return
    }
    if (!isValidPassword) {
        setError('Password does not meet requirements')
        return
    }
    setStep(2)
  }

  const handlePrevStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setStep(1)
  }

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setError('')

    if (!phone || !city || !state || !serviceRadius) {
      setError('Please fill in all fields')
      return
    }

    if (categories.length === 0) {
      setError('Please select at least one category')
      return
    }

    try {
      const response = await signup({
        fullName,
        username,
        email,
        password,
        phone,
        categories,
        city,
        state,
        serviceRadius: Number(serviceRadius)
      })

      const token = response?.accessToken || response?.data?.accessToken;
      if (token) {
          Cookies.set('accessToken', token);
      }

      queryClient.invalidateQueries({ queryKey: ['customerDashboard'] })
      toast.success("Signup Successful")
      navigate('/provider/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Signup failed. Please try again.')
    }
  }

  return (
    <AuthLayout illustration={LoginIllustration}>
      <AuthForm>
        <div className="flex justify-between items-end mb-8">
           <h2 className='font-semibold text-3xl'>Become a Provider.</h2>
           <span className="text-slate-500 font-medium text-sm bg-slate-100 px-3 py-1 rounded-full">Step {step} of 2</span>
        </div>
        
        <div className="flex flex-col gap-5 w-full">
          {step === 1 ? (
            <>
              <div className="grid grid-cols-2 gap-5">
                <Input 
                  label="Full Name" 
                  type="text" 
                  placeholder="Amaka Johnson" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={error && !fullName ? 'Full Name is required' : ''}
                />
                <Input 
                  label="Username" 
                  type="text" 
                  placeholder="amakaj" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={error && !username ? 'Username is required' : ''}
                />
              </div>
              
              <Input 
                label="Email" 
                type="email" 
                placeholder="amaka.provider@test.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error && !email ? 'Email is required' : ''}
              />

              <Input 
                label="Password" 
                type="password" 
                placeholder="*****************" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error && !password ? 'Password is required' : ''}
              />

              <div className="flex flex-col gap-2 mb-2">
                <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full ${hasMinLength ? 'bg-[var(--color-success)]' : 'bg-[#E5E7EB]'}`}></div>
                    <span className={`text-[14px] ${hasMinLength ? 'text-[var(--color-blue)]' : 'text-[#9CA3AF]'}`}>
                        Must contain a minimum of 8 characters
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full ${hasUppercase ? 'bg-[var(--color-success)]' : 'bg-[#E5E7EB]'}`}></div>
                    <span className={`text-[14px] ${hasUppercase ? 'text-[var(--color-blue)]' : 'text-[#9CA3AF]'}`}>
                        Must contain at least one uppercase letter
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full ${hasNumber ? 'bg-[var(--color-success)]' : 'bg-[#E5E7EB]'}`}></div>
                    <span className={`text-[14px] ${hasNumber ? 'text-[var(--color-blue)]' : 'text-[#9CA3AF]'}`}>
                        Must contain at least one number
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full ${hasSpecialCharacter ? 'bg-[var(--color-success)]' : 'bg-[#E5E7EB]'}`}></div>
                    <span className={`text-[14px] ${hasSpecialCharacter ? 'text-[var(--color-blue)]' : 'text-[#9CA3AF]'}`}>
                        Must contain at least one special character (!@#$%^&*())
                    </span>
                </div>
              </div>

              {error && (!fullName || !username || !email || !password || !isValidPassword) && (
                 <p className="text-red-500 text-sm">{error}</p>
              )}

              <div className="mt-4">
                <button 
                  onClick={handleNextStep}
                  disabled={!isValidPassword || !fullName || !username || !email}
                  className="bg-blue text-white px-8 py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full"
                >
                  Continue to Step 2
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-5">
                <Input 
                  label="Phone Number" 
                  type="tel" 
                  placeholder="08023456789" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={error && !phone ? 'Phone is required' : ''}
                />
                <Input 
                  label="Service Radius (km)" 
                  type="number" 
                  placeholder="15" 
                  value={serviceRadius}
                  onChange={(e) => setServiceRadius(e.target.value)}
                  error={error && !serviceRadius ? 'Radius is required' : ''}
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Input 
                  label="City" 
                  type="text" 
                  placeholder="Lagos" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  error={error && !city ? 'City is required' : ''}
                />
                <Input 
                  label="State" 
                  type="text" 
                  placeholder="Lagos" 
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  error={error && !state ? 'State is required' : ''}
                />
              </div>

              <div className="flex flex-col mb-4">
                  <label className="text-[#A1A1AA] text-[15px] mb-3">Service Categories</label>
                  <div className="flex flex-wrap gap-2">
                      {PROVIDER_CATEGORIES.map(cat => (
                          <button
                              key={cat}
                              onClick={(e) => { e.preventDefault(); toggleCategory(cat); }}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                  categories.includes(cat) 
                                    ? 'bg-blue text-white border-blue' 
                                    : 'bg-transparent text-slate-600 border-slate-300 hover:border-slate-400'
                              }`}
                          >
                              {cat}
                          </button>
                      ))}
                  </div>
                  {error && categories.length === 0 && (
                      <span className="text-[#CB3030] text-[14px] mt-2">Please select at least one category</span>
                  )}
              </div>

              {error && (!phone || !city || !state || !serviceRadius) && (
                 <p className="text-red-500 text-sm">{error}</p>
              )}

              <div className="mt-4 flex gap-3">
                <button 
                  onClick={handlePrevStep}
                  className="bg-slate-100 text-slate-700 px-6 py-3 rounded-full font-medium flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer w-1/3"
                >
                  Back
                </button>
                <button 
                  onClick={handleSignup}
                  disabled={isPending || !phone || !city || !state || !serviceRadius || categories.length === 0}
                  className="bg-blue text-white px-8 py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                >
                  {isPending ? (
                    <>
                      Signing up...
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </>
                  ) : (
                    <>
                      Complete Sign Up
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-[15px] text-slate-500">
              Already have an account?{' '}
              <Link to="/provider-login" className="text-blue hover:underline font-medium transition-colors">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </AuthForm>
    </AuthLayout>
  )
}

export default ProviderSignup
