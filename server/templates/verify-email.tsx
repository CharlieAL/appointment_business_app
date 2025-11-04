type Props = {
	name: string
	verificationUrl: string
	supportEmail?: string
	appName?: string
}

const PRIMARY = '#86198F'

export function VerifyEmail({
	name,
	verificationUrl,
	supportEmail = 'soporte@example.com',
	appName = 'Citto',
}: Props) {
	return (
		<html lang="es">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
			</head>
			<body style={{ margin: 0, padding: 0, backgroundColor: '#f4f4f6' }}>
				<table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
					<tbody>
						<tr>
							<td align="center" style={{ padding: '24px 12px' }}>
								<table
									width="600"
									cellPadding="0"
									cellSpacing="0"
									role="presentation"
									style={{
										borderRadius: 8,
										overflow: 'hidden',
										backgroundColor: '#ffffff',
										boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
									}}
								>
									<tbody>
										<tr>
											<td style={{ padding: '28px 40px', textAlign: 'left' }}>
												{/* Header */}
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														gap: 12,
													}}
												>
													<div
														style={{
															width: 48,
															height: 48,
															borderRadius: 8,
															backgroundColor: PRIMARY,
														}}
													/>
													<h1
														style={{
															margin: 0,
															fontSize: 20,
															color: '#111827',
														}}
													>
														{appName}
													</h1>
												</div>

												{/* Spacer */}
												<div style={{ height: 20 }} />

												{/* Content */}
												<p
													style={{ margin: 0, fontSize: 16, color: '#374151' }}
												>
													Hola <strong>{name}</strong>,
												</p>

												<div style={{ height: 12 }} />

												<p
													style={{
														margin: 0,
														fontSize: 15,
														color: '#374151',
														lineHeight: 1.6,
													}}
												>
													Gracias por registrarte en <strong>{appName}</strong>.
													Para completar el registro y verificar tu correo, haz
													click en el botón debajo:
												</p>

												<div style={{ height: 18 }} />

												{/* Button */}
												<table
													role="presentation"
													cellPadding="0"
													cellSpacing="0"
												>
													<tbody>
														<tr>
															<td align="center">
																<a
																	href={verificationUrl}
																	target="_blank"
																	rel="noopener noreferrer"
																	style={{
																		display: 'inline-block',
																		padding: '12px 22px',
																		borderRadius: 8,
																		backgroundColor: PRIMARY,
																		color: '#ffffff',
																		textDecoration: 'none',
																		fontWeight: 600,
																		fontSize: 15,
																	}}
																>
																	Verificar mi correo
																</a>
															</td>
														</tr>
													</tbody>
												</table>

												<div style={{ height: 18 }} />

												<p
													style={{ margin: 0, fontSize: 13, color: '#6b7280' }}
												>
													Si el botón no funciona, copia y pega esta URL en tu
													navegador:
												</p>

												<div style={{ height: 8 }} />

												<p
													style={{
														margin: 0,
														fontSize: 12,
														color: '#6b7280',
														wordBreak: 'break-all',
													}}
												>
													{verificationUrl}
												</p>

												<div style={{ height: 20 }} />

												<p
													style={{ margin: 0, fontSize: 13, color: '#6b7280' }}
												>
													Si no solicitaste esta verificación, puedes ignorar
													este correo o escribirnos a{' '}
													<a
														href={`mailto:${supportEmail}`}
														style={{ color: PRIMARY, textDecoration: 'none' }}
													>
														{supportEmail}
													</a>
													.
												</p>

												<div style={{ height: 28 }} />

												<hr
													style={{
														border: 'none',
														borderTop: '1px solid #e6e6e9',
													}}
												/>

												<div style={{ height: 14 }} />

												<p
													style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}
												>
													© {new Date().getFullYear()} {appName}. Todos los
													derechos reservados.
												</p>
											</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
					</tbody>
				</table>
			</body>
		</html>
	)
}
