import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import LoginIllustration from '../../assets/auth/svg_login.svg'
import AuthForm from '../../components/ui/AuthForm'
import Input from '../../components/ui/Input'
import { useProviderLogin } from '../../hooks/useAuth.ts'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

const ProviderLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { mutateAsync: login, isPending } = useProviderLogin()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('invalid email or password')
      return
    }

    try {
      const res = await login({ email, password })
      if (res?.status === "invalid" || !res) {
        setError('invalid email or password')
      } else {
        queryClient.invalidateQueries({ queryKey: ['customerDashboard'] })
        toast.success("Login Successful")
        navigate('/provider/dashboard')
      }
    } catch (err) {
      setError('invalid email or password')
    }
  }

  return (
    <AuthLayout illustration={LoginIllustration}>
      <AuthForm>
        <div>
           <h2 className='font-semibold text-3xl mb-6'>Provider Login.</h2>
        </div>
        <div className="flex flex-col gap-6 w-full">
          <Input 
            label="Login" 
            type="email" 
            placeholder="2pacshakur@gmail.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="*****************" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-end -mt-2 mb-6">
            <Link to="/forgot-password" className="text-[15px] text-blue hover:opacity-70 transition-opacity">
              Forgot password?
            </Link>
          </div>
          <div>
            <button 
              onClick={handleLogin}
              disabled={isPending}
              className="bg-blue text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  Logging in...
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </>
              ) : (
                <>
                  Login
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
            
            <div className="mt-8">
              <p className="text-[15px] text-slate-500">
                Don't have an account?{' '}
                <Link to="/provider-signup" className="text-blue hover:underline font-medium transition-colors">
                  Signup here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </AuthForm>
    </AuthLayout>
  )
}

export default ProviderLogin