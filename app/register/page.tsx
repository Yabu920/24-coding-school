import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { RegisterForm } from '@/components/auth/register-form'

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  )
}
