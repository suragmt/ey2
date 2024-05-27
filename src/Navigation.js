import React from "react";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <div>
      <ul>
        <Link to={"/"}>Home</Link>
        <Link to={"contacts"}>Contacts</Link>
      </ul>
    </div>
  );
}
