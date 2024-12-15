import SubWrapper from "./SubWrapper";

export default async function Home({ params, searchParams }) {
  const { habitid } = await params;
  const { joinid } = await searchParams;
  return <SubWrapper habitId={habitid} joinId={joinid} />;
}
