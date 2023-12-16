"use client";

import styled from "@emotion/styled";
import { useEffect, useState } from "react";

const Main = styled.main`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  * {
    border: 1px solid black;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const Section = styled.section`
  display: flex;
  flex: 1;
`;

const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  ul {
    list-style: none;
    background-color: darkgray;
    color: white;
  }
`;

const SectionSide = styled.div`
  display: flex;
  flex-direction: column;
`;

const Note = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export default function Home() {
  return (
    <Main>
      <Section>
        <SectionSide>
          <h1>notes title</h1>
          <div>
            <h2>note title</h2>
            <p>note description</p>
          </div>
        </SectionSide>
        <Note>
          <h2>note title</h2>
          <div>note content</div>
        </Note>
      </Section>
      <Aside>
        <h2>notebooks</h2>
        <ul>
          <li>notes title</li>
        </ul>
      </Aside>
    </Main>
  );
}
