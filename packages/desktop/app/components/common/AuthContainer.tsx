import React, { useState, useContext, useEffect } from "react";
import { Box, Container } from "@mui/material";
import Image from "next/image";

const AuthContainer = (props) => {
  const { children } = props;
  return <Container maxWidth="sm">{children}</Container>;
};

export default AuthContainer;
