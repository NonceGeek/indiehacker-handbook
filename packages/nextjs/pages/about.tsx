import React, { useState } from "react";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const ExampleUI: NextPage = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [fixedToViewport, setFixedToViewport] = useState(false);

  const handleClick = event => {
    const { clientX } = event; // 获取鼠标相对于视口的 X 坐标
    const viewportTopY = window.scrollY; // 获取当前滚动位置的 Y 坐标

    // 将 X 设置为鼠标点击的 X 坐标，将 Y 设置为视口顶部的 Y 坐标
    setPosition({ x: clientX, y: viewportTopY - 100});
    setFixedToViewport(true); // 标记方块已被定位到视口顶部
  };
  return (
    <>
      <MetaHeader
        title="About | 说明"
        description="The about of Indiehacker handbook/Indiehacker startup operation system"
      >
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="grid lg:grid-cols-1 flex-grow" data-theme="exampleUi">
        <center>
          <p>
            <b>作者微信：</b> 197626581
          </p>
          <p>
            <b>Author Twitter:</b> https://x.com/0xleeduckgo
          </p>
          <p>
            <b>Author TG:</b> https://t.me/leeduckgo
          </p>
        </center>
        <div
          style={{
            height: "500vh", // 增加页面高度以便测试滚动效果
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
          onClick={handleClick}
        >
          {/* 可移动的元素 */}
          <div
            style={{
              position: "absolute", // 使用绝对定位
              top: fixedToViewport ? `${position.y}px` : "0", // Y 坐标固定在当前视口顶部
              left: position.x, // 根据点击位置更新 X 坐标
              width: "50px",
              height: "50px",
              backgroundColor: "blue",
              transition: "left 0.2s ease, top 0.2s ease", // 平滑过渡效果
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ExampleUI;
