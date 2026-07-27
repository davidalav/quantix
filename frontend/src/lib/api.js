const API_URL="http://localhost:8000";


export async function loginUser(data){

  const response = await fetch(
    `${API_URL}/login/`,
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(data)
    }
  );


  const result = await response.json();


  if(!response.ok){
    throw new Error(
      result.detail || "Login failed"
    );
  }


  return result;
}


export async function registerUser(data){

  const response = await fetch(
    `${API_URL}/create_user/`,
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(data)
    }
  );


  const result = await response.json();


  if(!response.ok){
    throw new Error(
      result.detail || "Registration failed"
    );
  }


  return result;
}