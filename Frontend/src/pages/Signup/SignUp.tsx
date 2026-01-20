import { Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';
import { useForm } from "react-hook-form"
import { authStore } from '../../store/auth.store';
import { Toaster } from 'react-hot-toast';
const SignUpPage = () => {
    const [typePassword, setTypePassword] = useState(false);
    const { isSignningUp, signUp } = authStore()
    const { register, handleSubmit } = useForm()
    return (
        <>
            <div className="justify-center items-center h-screen flex lg:grid lg:grid-cols-2">

                <div className="justify-center items-center flex flex-col gap-10">

                    <div className="justify-center items-center flex flex-col gap-3">
                        <div className="text-5xl font-bold">SignUp</div>
                        <div className="text-2xl font-medium">Already have a account? Login!</div>
                    </div>

                    <form onSubmit={handleSubmit(signUp)}>
                        <div className="flex flex-col gap-5 justify-center items-center p-2">
                            <div className="flex gap-5">
                                <span>
                                    <input placeholder='FullName' type="text" id="fullName-input" className="bg-primary/5 focus:outline-none focus:border-0 focus:ring-0 w-38 rounded-xl p-2 "  {...register("fullName")} />
                                </span>
                                <span>
                                    <input placeholder='UserName' type="text" id="userName-input" className="bg-primary/5 focus:outline-none focus:border-0 focus:ring-0 w-38 rounded-xl p-2 "  {...register("userName")} />
                                </span>
                            </div>
                            <div className="flex gap-5">
                                <input placeholder='Email' type="text" id="email-input" className="bg-primary/5 focus:outline-none focus:border-0 focus:ring-0 w-80 rounded-xl p-2 "  {...register("email")} />
                            </div>
                            <div className="flex gap-5 justify-center items-center">
                                <span className='flex justify-center items-center bg-primary/5 rounded-xl p-2'>
                                    <input type={typePassword ? `text` : `password`} placeholder='Password' id="password-input"
                                        className="focus:outline-none focus:border-0 focus:ring-0 w-72" {...register("password")} />
                                    <button type="button" onClick={() => setTypePassword((s) => !s)}>
                                        {typePassword ? <Eye /> : <EyeClosed />}
                                    </button>
                                </span>
                            </div>
                            <div>
                                <button type='submit' disabled={isSignningUp} className={`bg-accent w-76 p-2 rounded-3xl font-bold active:scale-95 active:bg-accent/75 disabled:bg-accent/70 disabled:text-white/80 disabled:scale-100`}>
                                    {isSignningUp ? "Loginning" : "Login"}
                                </button>
                                <Toaster />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignUpPage