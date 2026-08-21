import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import LoginIllustration from '../../assets/auth/svg_login.svg'
import AuthForm from '../../components/ui/AuthForm'
import Input from '../../components/ui/Input'
import { toast } from 'sonner'
import { useSignup } from '../../hooks/useAuth'
import { useQueryClient } from '@tanstack/react-query'

const Signup = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const { mutateAsync: signup, isPending } = useSignup()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialCharacter = /[!@#$%^&*()]/.test(password);

  const isValidPassword = hasMinLength && hasUppercase && hasNumber && hasSpecialCharacter;

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setError('')

    if (!firstName || !lastName || !email || !password || !phone) {
      setError('Please fill in all fields')
      return
    }

    if (!isValidPassword) {
      setError('Password does not meet requirements')
      return
    }

    try {
      await signup({
        firstName,
        lastName,
        email,
        password,
        phone,
        role: "CUSTOMER"
      })

      queryClient.invalidateQueries({ queryKey: ['customerDashboard'] })
      toast.success("Signup Successful")
      navigate('/login')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Signup failed. Please try again.')
    }
  }

  return (
    <AuthLayout illustration={LoginIllustration}>
      <AuthForm>
        <div>
           <h2 className='font-semibold text-3xl mb-6'>Create an Account.</h2>
        </div>
        <div className="flex flex-col gap-5 w-full">
          <div className="grid grid-cols-2 gap-5">
            <Input 
              label="First Name" 
              type="text" 
              placeholder="Tupac" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={error && !firstName ? 'First Name is required' : ''}
            />
            <Input 
              label="Last Name" 
              type="text" 
              placeholder="Shakur" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={error && !lastName ? 'Last Name is required' : ''}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <Input 
              label="Email" 
              type="email" 
              placeholder="2pacshakur@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error && !email ? 'Email is required' : ''}
            />
            <Input 
              label="Phone" 
              type="tel" 
              placeholder="1234567890" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={error && !phone ? 'Phone is required' : ''}
            />
          </div>

          <Input 
            label="Password" 
            type="password" 
            placeholder="*****************" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error && !password ? 'Password is required' : ''}
          />

          <div className="flex flex-col gap-2">
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
          
          {error && firstName && lastName && email && password && phone && (
             <p className="text-red-500 text-sm mt-1">{error}</p>
          )}

          <div className="mt-2">
            <button 
              onClick={handleSignup}
              disabled={isPending || !isValidPassword || !firstName || !lastName || !email || !phone}
              className="bg-blue text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-fit"
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
                  Sign Up
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
            
            <div className="mt-8">
              <p className="text-[15px] text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-blue hover:underline font-medium transition-colors">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </AuthForm>
    </AuthLayout>
  )
}

export default Signup
