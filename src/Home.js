import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUsers } from "./users";
export default function Home() {
  const [name, setName] = useState("");
  const client = useQueryClient()
  const { data, isLoading } = useQuery({
    queryFn: () => getUsers(),
    queryKey: ["users"],
  });

  const { mutateAsync: addUserToLis } = useMutation({
    mutationFn: createUser,
    onSuccess: ()=>{
        client.invalidateQueries(["users"])
    }
  });
  if (isLoading) {
    return <div>loading</div>;
  }
  return (
    <>
      <div>
        Home
        <ol>{data && data.map((item) => <li>{item.first_name}</li>)}</ol>
      </div>
      <div>
        <div>
          <label>name</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div>
          <button
            onClick={async () => {
              await addUserToLis(name);
              setName("");
            }}
          >
            submited
          </button>
        </div>
      </div>
    </>
  );
}
