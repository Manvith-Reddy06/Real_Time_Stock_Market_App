'use server'  // you only want to use this inside server as you have sensitive info as passwords

import {auth} from  "@/lib/better-auth/auth";
import {inngest} from "@/lib/inngest/client"
import { headers } from "next/headers";


//destructure data from onsubmit data here and use them in better-auth signin and innegst
export const signUpWithEmail =async({email,password,fullName,country,investmentGoals,riskTolerance,preferredIndustry}:SignUpFormData)=>{
    try{
        //this line is for better-auth ... it logs the user in by hashing the password storing in db etc
        const response= await auth.api.signUpEmail({
            body:{email,password,name:fullName}
        })

        //it sends the response forward to inngest
        if(response){
            await inngest.send({
                name:'app/user/created',
                data:{
                    email,name:fullName,country,investmentGoals,riskTolerance,preferredIndustry
                }
            })
        }

        return {success:true, data : response}
    }
    catch(e){
        console.log('Sign up failed',e)
        return {
            success:false,
            error: 'Sign Up Failed'
        }
    }
}
//destructure data from onsubmit data here and use them in better-auth signin and innegst
export const signInWithEmail =async({email,password}:SignInFormData)=>{
    try{
        //this line is for better-auth ... it logs the user in by hashing the password storing in db etc
        const response= await auth.api.signInEmail({
            body:{email,password}
        })

        

        return {success:true, data : response}
    }
    catch(e){
        console.log('Sign In failed',e)
        return {
            success:false,
            error: 'Sign In Failed'
        }
    }
}

export const signOutWithEmail = async()=>{
    try{
        await auth.api.signOut({headers: await headers()});
    }
    catch(e){
        console.log("Sign out Failed",e);
        return {success:false , error:"Sign Out Failed" }
    }
}