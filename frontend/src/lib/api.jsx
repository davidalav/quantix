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

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function crawlWebsite(data) {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/api/crawl`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Crawl failed");
  }

  return result;
}