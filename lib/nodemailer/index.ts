import { getFormattedTodayDate } from '@/lib/utils';
import nodemailer from 'nodemailer';
import { NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from './templates';

export const transporter = nodemailer.createTransport({
    service:'gmail',
    auth : {
        user: process.env.NODEMAILER_EMAIL!,
        pass : process.env.NODEMAILER_PASSWORD!,
    }
})

export const sendWelcomeEmail=async({email,name,intro}:WelcomeEmailData)=>{
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}',name)
        .replace('{{intro}}',intro);

    const mailOptions= {
        from: `"Stock Analyzer" <manvithreddy2021@gmail.com>`,
        to : email,
        subject : ' Welcome- your stock market toolkit is ready!',
        text: 'Thanks for joining us',
        html : htmlTemplate
    }

    await transporter.sendMail(mailOptions);
}

export const sendNewsSummaryEmail = async ({
    email,
    name,
    newsContent,
}: NewsSummaryEmailData) => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE.replace(
        '{{date}}',
        getFormattedTodayDate()
    ).replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `"Stock Analyzer" <${process.env.NODEMAILER_EMAIL!}>`,
        to: email,
        subject: `Your Daily Market News Summary`,
        text: 'Your personalized market news summary is ready.',
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};

