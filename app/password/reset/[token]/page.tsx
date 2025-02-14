import ResetPassword from "@/components/auth/ResetPassword";

const ResetPasswordPage = async ({ params }: { params: { token: string } }) => {
  const { token } = await params;
  return <ResetPassword token={token} />;
};

export default ResetPasswordPage;
