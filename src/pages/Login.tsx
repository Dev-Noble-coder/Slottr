import AuthLayout from '../components/layouts/AuthLayout'
import LoginIllustration from '../assets/auth/svg_login.svg'
import AuthForm from '../components/ui/AuthForm'
import Input from '../components/ui/Input'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <AuthLayout illustration={LoginIllustration}>
      <AuthForm>
        <div>
           <h2 className='font-semibold text-3xl mb-6'>Welcome Back.</h2>
        </div>
        <div className="flex flex-col gap-6 w-full">
          <Input 
            label="Login" 
            type="email" 
            placeholder="2pacshakur@gmail.com" 
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="*****************" 
          />
          <div className="flex justify-end -mt-2 mb-6">
            <Link to="/forgot-password" className="text-[15px] text-blue hover:opacity-70 transition-opacity">
              Forgot password?
            </Link>
          </div>
          <div>
            <button className="bg-blue text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer">
              Login
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </AuthForm>
    </AuthLayout>
  )
}

export default Login