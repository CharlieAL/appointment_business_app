import * as nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const SMTP_SERVICE = process.env.SMTP_SERVICE

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_SERVICE) {
	throw new Error('SMTP configuration is incomplete in environment variables')
}

const transporter = nodemailer.createTransport({
	host: SMTP_HOST,
	port: Number(SMTP_PORT) || 587,
	service: SMTP_SERVICE,
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASS,
	},
})

export const sendEmail = async ({
	to,
	subject,
	template,
}: {
	to: string
	subject: string
	template: string
}) => {
	try {
		console.log('[ 📧 SENDING EMAIL 📧 ]')
		await transporter.sendMail({
			from: process.env.SMTP_USER,
			to,
			subject,
			html: template,
		})
		console.log('[ ✅ EMAIL SENT ✅ ] to:', to)
		return true
	} catch (error) {
		console.log('[ ❌ EMAIL ERROR ❌]', error)
		return false
	}
}
