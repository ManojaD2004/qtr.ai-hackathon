import SubWrapper from "./SubWrapper";

export default async function Home({ params, searchParams }) {
  const { habitid } = await params;
  const { joinid } = await searchParams;
  console.log(process.env.SECRET);
  return <SubWrapper habitId={habitid} joinId={joinid} />;
}
