'use client';
import { CountrySelectField } from '@/components/forms/CountrySelectField';
import FooterLink from '@/components/forms/FooterLink';
import InputField from '@/components/forms/InputField';
import SelectField from '@/components/forms/SelectField';
import { Button } from '@/components/ui/button';
import { signUpWithEmail } from '@/lib/actions/auth.actions';
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from '@/lib/constants';
import { error } from 'console';
import { useRouter } from 'next/navigation';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';


const SignUp = () => {
    const router=useRouter();
    //name of interface to create - SignUpFormData
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<SignUpFormData>({
        defaultValues: {
            fullName:'',
            email:'',
            password:'',
            country:'US',
            investmentGoals:'Growth',
            riskTolerance:'Medium',
            preferredIndustry:'Technology'
        },
        mode:'onBlur' // secondary parameter
    },);
    const onSubmit = async(data:SignUpFormData) => {
        try{
            const result=signUpWithEmail(data);
            if((await result).success)router.push('/');
        }
        catch(e){
            console.error(e);
            toast.error('Sign Up Failed',{
                description: e instanceof Error?e.message: 'Failed to create an account'
            })
        }
    }
  return (
      <>
        <h1 className='form-title'>Sign Up & Customize</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            {/* INPUTS */}
      {/* we are writing inputs as a reusable component */}
            <InputField
                name="fullName"
                label="Full Name"
                placeholder="Ravi Reddy"
                register={register}
                error={errors.fullName}
                validation={{
                    required: 'Full Name is Required',
                    minLength: {
                        value: 2,
                        message: 'Minimum 2 characters required'
                    }
                }}
            />
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
                    }
                }}

                
                
                />
                <CountrySelectField
                    name="country"
                    label="Country"
                    control={control}
                    error={errors.country}
                    required
                />
                <SelectField
                    name="investment-goals"
                    label= "Investment Goals"
                    placeholder= "Select your Investment Goals"
                    options={INVESTMENT_GOALS}
                    control={control}
                    error= {errors.investmentGoals}
                    required
                />
                <SelectField
                    name="riskTolerance"
                    label= "Risk Tolerance"
                    placeholder= "Select your Risk Level"
                    options={RISK_TOLERANCE_OPTIONS}
                    control={control}
                    error= {errors.riskTolerance}
                    required
                />
                <SelectField
                    name="preferredIndustry"
                    label= "Preferred Industry"
                    placeholder= "Select your Investment Goals"
                    options={PREFERRED_INDUSTRIES}
                    control={control}
                    error= {errors.preferredIndustry}
                    required
                />

            <Button type='submit' disabled={isSubmitting} className='yellow-btn w-full mt-5'>
                {isSubmitting ? 'Creating Account' : 'Start Your Investment Journey'}
            </Button>

            <FooterLink
                text='Already have an account?'
                linkText='Sign In'
                href='/sign-in'
            />
        </form>
    </>
  )
}

export default SignUp