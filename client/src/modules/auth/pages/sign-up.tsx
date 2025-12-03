import { zodResolver } from '@hookform/resolvers/zod'
import { GalleryVerticalEnd } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useLocation } from 'wouter'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'

const formSchema = z.object({
	name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
	email: z.email('Porfavor ingresa un correo válido'),
	phone: z.string().optional(),
	password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export function SignUpPage() {
	const [_, navigate] = useLocation()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			password: '',
		},
	})

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { data, error } = await authClient.signUp.email(
			{
				name: values.name,
				email: values.email,
				// this works, but better-auth has no handle others data like phone
                // sign-up method yet
				phone: values.phone,
				password: values.password,
				callbackURL: '/',
			},
			{
				onRequest: (ctx) => {
					console.log('onRequest', ctx)
				},
				onSuccess: (ctx) => {
					console.log('onSuccess', ctx)
					navigate('/', { replace: true })
				},
				onError: (ctx) => {
					console.log('onError', ctx)
				},
			}
		)
		if (error) {
			console.error('Error signing in:', error)
		}
		console.log('Sign-in data:', data)
	}

	return (
		<div>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FieldGroup>
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
								Ya tienes una cuenta?{' '}
								<Link to="/login" className="underline underline-offset-4">
									Inicia sesión
								</Link>
							</div>
						</div>
						<div className="flex flex-col gap-6">
							<div className="grid gap-3">
								<Controller
									control={form.control}
									name="name"
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
											<Input
												id={field.name}
												placeholder="Juan Perez"
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
									name="email"
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>Correo</FieldLabel>
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
									name="phone"
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>
												Telefono (opcional)
											</FieldLabel>
											<Input
												id={field.name}
												type="tel"
												placeholder="+52 1 234 567 8901"
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
												<FieldLabel htmlFor={field.name}>Contrasena</FieldLabel>
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

							<Button type="submit" className="w-full">
								Registrarse
							</Button>
						</div>
					</div>
				</FieldGroup>
			</form>

			{/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4"> */}
			{/* 	By clicking continue, you agree to our <span>Terms of Service</span> and{' '} */}
			{/* 	<span>Privacy Policy</span>. */}
			{/* </div> */}
			{/**/}
		</div>
	)
}
