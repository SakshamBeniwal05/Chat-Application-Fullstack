import { Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';
import { useForm } from "react-hook-form"
import { authStore } from '../../store/auth.store';
import type { LoginData } from '../../types/types';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../../components/Animated/Animated';

const LoginPage = () => {
  const [typePassword, setTypePassword] = useState(false);
  const { isLoggingIn, login } = authStore()
  const { register, handleSubmit } = useForm<LoginData>()
  return (
    <>
      <div className="justify-center items-center h-screen flex lg:grid lg:grid-cols-2">

        <div className="justify-center items-center flex flex-col gap-10">

          <div className="justify-center items-center flex flex-col gap-3">
            <div className="text-5xl font-bold">Login</div>
            <div className="text-2xl font-medium">
              <span>Didn't have a account?</span>
              <Link to={"https://chat-application-fullstack-h3ip.vercel.app/register"}>
                <span className="text-blue-600 underline">Sign Up!</span>
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit(login)}>
            <div className="flex flex-col gap-5 justify-center items-center p-2">
              <div className="flex gap-5">
                <input placeholder='Email' type="text" id="email-input" className="bg-primary/5 focus:outline-none focus:border-0 focus:ring-0 w-78 rounded-xl p-2 "  {...register("email")} />
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
                <button type='submit' disabled={isLoggingIn} className={`bg-accent w-76 p-2 rounded-3xl font-bold active:scale-95 active:bg-accent/75 disabled:bg-accent/70 disabled:text-white/80 disabled:scale-100`}>
                  {isLoggingIn ? "Loginning" : "Login"}
                </button>
              </div>
            </div>
          </form>

        </div>

        <AuthImagePattern
          title={"Welcome back!"}
          subtitle={"Sign in to continue your conversations and catch up with your messages."}
        />

      </div>
    </>
  );
};
export default LoginPage;