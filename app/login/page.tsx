
// THIS IS WORKING CODE BUT MOVE TO ROUTE PAGE
// app/login/page.tsx
// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signIn, getSession } from "next-auth/react";

// import { Header } from "@/components/layout/header";
// import { Footer } from "@/components/layout/footer";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { Eye, EyeOff, User2, Lock } from "lucide-react";
// import type { Role } from "@prisma/client";

// export default function LoginPage() {
//   const router = useRouter();
//   const [role, setRole] = useState<Role>("student");
//   const [emailOrUsername, setEmailOrUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       // sign in (credentials provider). send role as string
//       const res = await signIn("credentials", {
//         redirect: false,
//         emailOrUsername,
//         password,
//         role: String(role).toLowerCase(),
//       });

//       if (!res || res.error) {
//         setError("Invalid credentials");
//         return;
//       }

//       // Try to get fresh session (server-side)
//       const session = await getSession();

//       const actualRole =
//         session?.user?.role ?? String(role).toLowerCase();

//       // Redirect based on actualRole
//       if (actualRole === "teacher") router.push("/teacher-dashboard");
//       else if (actualRole === "admin") router.push("/admin-dashboard");
//       else if (actualRole === "student") router.push("/student-dashboard");
//       else router.push("/");
//     } catch (err) {
//       console.error("Login error", err);
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen">
//       <Header />
//       <main className="py-16">
//         <div className="container max-w-xl">
//           <Card>
//             <CardHeader>
//               <CardTitle>Sign in to your account</CardTitle>
//               <CardDescription>
//                 Choose your role and enter your credentials.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Tabs
//                 value={role}
//                 onValueChange={(v) => setRole(v as Role)}
//                 className="w-full"
//               >
//                 <TabsList className="grid grid-cols-3">
//                   <TabsTrigger value="student">Student</TabsTrigger>
//                   <TabsTrigger value="teacher">Teacher</TabsTrigger>
//                   <TabsTrigger value="admin">Admin</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="student" className="mt-6 space-y-4">
//                   <FormFields
//                     emailOrUsername={emailOrUsername}
//                     setEmailOrUsername={setEmailOrUsername}
//                     password={password}
//                     setPassword={setPassword}
//                     showPassword={showPassword}
//                     setShowPassword={setShowPassword}
//                   />
//                 </TabsContent>
//                 <TabsContent value="teacher" className="mt-6 space-y-4">
//                   <FormFields
//                     emailOrUsername={emailOrUsername}
//                     setEmailOrUsername={setEmailOrUsername}
//                     password={password}
//                     setPassword={setPassword}
//                     showPassword={showPassword}
//                     setShowPassword={setShowPassword}
//                   />
//                 </TabsContent>
//                 <TabsContent value="admin" className="mt-6 space-y-4">
//                   <FormFields
//                     emailOrUsername={emailOrUsername}
//                     setEmailOrUsername={setEmailOrUsername}
//                     password={password}
//                     setPassword={setPassword}
//                     showPassword={showPassword}
//                     setShowPassword={setShowPassword}
//                   />
//                 </TabsContent>
//               </Tabs>

//               <form onSubmit={handleSubmit} className="space-y-4 mt-4">
//                 <div className="flex items-center gap-2">
//                   <Checkbox
//                     id="remember"
//                     checked={rememberMe}
//                     onCheckedChange={(c) => setRememberMe(Boolean(c))}
//                   />
//                   <Label htmlFor="remember" className="text-sm">
//                     Remember me
//                   </Label>
//                 </div>
//                 {error && (
//                   <p className="text-sm text-red-600" role="alert">
//                     {error}
//                   </p>
//                 )}
//                 <Button
//                   type="submit"
//                   className="w-full"
//                   disabled={loading}
//                   aria-label="Sign in"
//                 >
//                   {loading ? "Signing in..." : "Sign In"}
//                 </Button>
//               </form>

//               <div className="mt-3">
//                 <a
//                   href="/forgot-password"
//                   className="text-sm text-primary hover:underline"
//                 >
//                   Forgot your password?
//                 </a>
//               </div>
//             </CardContent>
//             <CardFooter />
//           </Card>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// function FormFields(props: {
//   emailOrUsername: string;
//   setEmailOrUsername: (v: string) => void;
//   password: string;
//   setPassword: (v: string) => void;
//   showPassword: boolean;
//   setShowPassword: (v: boolean) => void;
// }) {
//   const {
//     emailOrUsername,
//     setEmailOrUsername,
//     password,
//     setPassword,
//     showPassword,
//     setShowPassword,
//   } = props;

//   return (
//     <div className="space-y-4">
//       <div>
//         <Label htmlFor="emailOrUsername">Email or Username</Label>
//         <div className="relative">
//           <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             id="emailOrUsername"
//             placeholder="you@example.com or username"
//             className="pl-9"
//             value={emailOrUsername}
//             onChange={(e) => setEmailOrUsername(e.target.value)}
//             required
//           />
//         </div>
//       </div>
//       <div>
//         <Label htmlFor="password">Password</Label>
//         <div className="relative">
//           <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             id="password"
//             type={showPassword ? "text" : "password"}
//             placeholder="••••••••"
//             className="pl-9 pr-9"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <button
//             type="button"
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
//             onClick={() => setShowPassword(!showPassword)}
//             aria-label={showPassword ? "Hide password" : "Show password"}
//           >
//             {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



