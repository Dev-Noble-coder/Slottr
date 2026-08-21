import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import ForgotPasswordIllustration from '../../assets/auth/svg_forgot_password.svg'
import AuthForm from '../../components/ui/AuthForm'
import Input from '../../components/ui/Input'
import { toast } from 'sonner'
import { useForgotPassword } from '../../hooks/useAuth'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const { mutateAsync: forgotPassword, isPending } = useForgotPassword()
    const navigate = useNavigate()

    const handleForgotPassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setError('')

        if (!email) {
            setError('Please enter your email')
            return
        }

        try {
            await forgotPassword({ email })
            toast.success("OTP sent to your email!")
            navigate(`/reset-password?email=${encodeURIComponent(email)}`)
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to send OTP. Please try again.')
        }
    }

    return (
        <AuthLayout illustration={ForgotPasswordIllustration}>
            <AuthForm>
                <div className='flex flex-col gap-10 w-full'>
                    <div className='text-blue'>
                        <h2 className='font-semibold text-3xl'>Forgot Password</h2>
                        <p className='text-[15px] mt-1 font-medium'>Enter your registered email address to reset</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Input 
                            label="Email Address" 
                            type="email" 
                            placeholder="johndoe@gmail.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={error && !email ? 'Email is required' : ''}
                        />
                        {error && email && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}
                    </div>
                </div>

                <div className='mt-5'>
                    <button 
                        onClick={handleForgotPassword}
                        disabled={isPending || !email}
                        className="bg-blue text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <>
                                Sending...
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </>
                        ) : (
                            <>
                                Continue
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </AuthForm>
        </AuthLayout>
    )
}

export default ForgotPassword