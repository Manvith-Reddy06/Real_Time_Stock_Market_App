'use client'
import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import { signInWithEmail } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from "sonner";

const SignIn = () => {
  const router=useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur", // secondary parameter
  });
  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signInWithEmail(data);
      if (result.success) {
        router.push('/');
      } else {
        toast.error('Sign In Failed', {
          description: result.error ?? 'Invalid email or password',
        });
      }
    } catch (e) {
      console.error(e);
      toast.error('Sign In Failed', {
        description: e instanceof Error ? e.message : 'Failed to sign in',
      });
    }
  };
  return (
  <>
  <h1 className="form-title">SignIn</h1>
  <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            {/* INPUTS */}
      {/* we are writing inputs as a reusable component */}
            
            <InputField
                name="email"
                label="Email"
                placeholder="emailname@email.com"
                register={register}
                error={errors.email}
                validation={{
                    required: 'Email is Required',
                    pattern : /^\w+@\w+\.\w+$/,
                    minLength: {
                        value: 2,
                        message: 'Email address is  required'
                    }
                }}
            />
            <InputField
                name="password"
                label="Password"
                placeholder="Enter a strong password"
                type='password'
                register={register}
                error={errors.password}
                validation={{
                    required: 'Password is Required',
                    minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                    }
                }}

                
                
                />

            <Button type='submit' disabled={isSubmitting} className='yellow-btn w-full mt-5'>
                {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>

            <FooterLink
                text="Don't have an Account? Click here"
                linkText='Sign Up'
                href='/sign-up'
            />
        </form>
  </>
  );
}
export default SignIn;
