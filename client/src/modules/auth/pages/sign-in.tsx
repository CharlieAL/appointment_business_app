import { zodResolver } from '@hookform/resolvers/zod'
import { GalleryVerticalEnd } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useLocation } from 'wouter'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth-client'
import { useUser } from '../hooks/useUser'

const formSchema = z.object({
	email: z.email('Porfavor ingresa un correo válido'),
	password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export function SignInPage() {
	const { saveUserSession } = useUser()
    const [_, navigate] = useLocation()
	const [rememberMe, setRememberMe] = useState(false)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { data, error } = await authClient.signIn.email({
			email: values.email,
			password: values.password,
			rememberMe: rememberMe,
		})
		if (error) {
			console.log('Error signing in:', error)
		}
		// save user storage
		if (data?.user) {
            // this works but better-auth cant change type of user yet
			saveUserSession(data.user)
		}
        navigate('/', {replace:true})
	}

	return (
		<div>
			<FieldGroup>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-6">
						<div className="flex flex-col items-center gap-2">
							<Link
								to="/"
								className="flex flex-col items-center gap-2 font-medium"
							>
								<div className="flex size-8 items-center justify-center rounded-md">
									<GalleryVerticalEnd className="size-6" />
								</div>
							</Link>
							<h1 className="text-xl font-bold">Welcome to Eventity.</h1>
							<div className="text-center text-sm">
								No tienes una cuenta?{' '}
								<Link to="/register" className="underline underline-offset-4">
									Regístrate
								</Link>
							</div>
						</div>
						<div className="flex flex-col gap-6">
							<div className="grid gap-3">
								<Controller
									control={form.control}
									name="email"
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>Email</FieldLabel>
											<Input
												id={field.name}
												type="email"
												placeholder="m@example.com"
												{...field}
											/>

											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
								<Controller
									control={form.control}
									name="password"
									render={({ field, fieldState }) => (
										<Field>
											<div className="flex justify-between items-center">
												<FieldLabel htmlFor={field.name}>Password</FieldLabel>
												<Label className="underline cursor-pointer text-muted-foreground">
													Forgot password?
												</Label>
											</div>
											<Input
												id={field.name}
												type="password"
												placeholder="*********"
												{...field}
											/>

											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</div>
							{/* remember me checkbox */}
							<div className="flex items-center">
								<Checkbox
									id="rememberMe"
									checked={rememberMe}
									onCheckedChange={(checked) => setRememberMe(!!checked)}
								/>
								<Label htmlFor="rememberMe" className="ml-2 cursor-pointer">
									Mantener sesión iniciada
								</Label>
							</div>
							<Button
								type="submit"
								className="w-full"
								disabled={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting && <Spinner className="mr-2" />}
								Continuar
							</Button>
						</div>
					</div>
				</form>
			</FieldGroup>

			{/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4"> */}
			{/* 	By clicking continue, you agree to our <span>Terms of Service</span> and{' '} */}
			{/* 	<span>Privacy Policy</span>. */}
			{/* </div> */}
			{/**/}
		</div>
	)
}
