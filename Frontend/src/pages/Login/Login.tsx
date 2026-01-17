import { Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';
import { authStore } from '../../store/auth.store';
const LoginPage = () => {
  const [typePassword, setTypePassword] = useState(false);
  return (
    <>
      <div className="justify-center items-center h-screen grid grid-cols-2">

        <div className="justify-center items-center flex flex-col gap-10">

          <div className="justify-center items-center flex flex-col gap-3">
            <div className="text-5xl font-bold">Login</div>
            <div className="text-2xl font-medium">Didn't have a account? Sign Up!</div>
          </div>

          <div className="flex flex-col gap-5 justify-center items-center">
            <div className="flex gap-5">
              <input placeholder='Email' type="text" name="email-input" id="email-input" className="bg-primary/5 focus:outline-none focus:border-0 focus:ring-0 w-78 p-2 rounded-xl" />
            </div>
            <div className="flex gap-5 justify-center items-center">
              <span className='flex justify-center items-center bg-primary/5 rounded-xl'>
                <input type={typePassword ? `text` : `password`} placeholder='Password' name="password-input" id="password-input" 
                className="focus:outline-none focus:border-0 focus:ring-0 w-72 p-2" />
                <button onClick={() => setTypePassword((s) => !s)}>
                  {typePassword ? <Eye /> : <EyeClosed />}
                </button>
              </span>
            </div>
            <div>
            </div>
          </div>

        </div>

      </div>
    </>
  );
};
export default LoginPage;