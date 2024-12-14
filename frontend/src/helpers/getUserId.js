import constants from "./constants";

async function getUserId(userDeatils) {
  const emailId = userDeatils.user.email;
  const backEndLink = constants.backEndLink;
  const res = await fetch(`${backEndLink}/db/v1/users/details/${emailId}`);
  const resJson = await res.json();
  if (resJson.rowCount === 0) {
    const resBody1 = {
      emailId: userDeatils.user.email,
      userName: userDeatils.user.name,
      userImg: userDeatils.user.image,
    };

    const res1 = await fetch(`${backEndLink}/db/v1/users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resBody1),
    });
    const resJson1 = await res1.json();
    return resJson1.rows[0].id;
  }
  return resJson.rows[0].id;
}

export default getUserId;
