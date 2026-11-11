---
title: EtherNet/IP 通讯测试：监视、触发与握手时序
summary: "把监视表切到二进制，按 Trigger Enable → Trigger Ready → Trigger → Results OK/NG → Results Ack 走一轮，通讯成没成一眼就能看出来。"
tags: [EtherNet/IP, EIP, 时序, 触发, 监视表, 通讯排查]
level: 进阶
updated: 2026-11-11
order: 10
---

# EtherNet/IP 通讯测试：监视、触发与握手时序

两侧都配完，剩下的就是跑一轮握手：PLC 置控制位，相机回状态位，读到码再把结果取走。哪一步卡住，监视表上一目了然。

## 一、先把监视表打开

1. 点击 **监视标签页**，在名称里输入 `DataOut` 或 `DataIn`，下方就会显示这段区域的值。
2. **显示格式**按列切换：状态位用 **Binary**，条码内容用 **ASCII**。

位、字节、字的关系要先理顺：

![一个字 = 两个字节 = 16 位，分高 8 位和低 8 位；一个寄存器占一个字](/images/communication/eip-comm-test/fig-02-word-byte-bit.webp)

- 一位只能是 0 或 1，字节是 8 位，字（WORD）是 16 位，对应 PLC 的一个寄存器。
- 一个寄存器分高 8 位、低 8 位，字节交换打开时高低位会对调。
- 相机侧的组件按**字节**算，PLC 的 DM 地址按**字**算：200 字节 = 100 个字，写地址时别按 200 个字留。

## 二、一轮握手长什么样

一轮完整的握手是六个动作，顺序不能乱：

1. PLC 置 Trigger Enable：`DataOut[0].bit0 = 1`。
2. 相机就绪后回 Trigger Ready：`DataIn[2].bit0 = 1`。
3. PLC 发 Trigger：`DataOut[0].bit1`；相机回 Trigger Ack（`DataIn[2].bit1`），随后 Acquiring（bit2）、Decoding（bit3）依次动作。
4. 读到码 → Results OK（`DataIn[3].bit0`），条码写进 `DataIn[20]` 起的地址；没读到 → Results NG（`DataIn[3].bit1`），`DataIn[20]` 起清零。
5. PLC 读完结果 → Results Ack（`DataOut[0].bit2`），相机清掉状态，重新回 Trigger Ready，可以发下一次 Trigger。
6. 相机内部异常 → General Fault（`DataIn[3].bit7`），确认原因后 PLC 置 Clear Error（`DataOut[1].bit7`）清错，再继续触发。

这些信号分别落在哪一位，按方向分两组：

**PLC → 相机（输出映像区）**

- Trigger Enable `DataOut[0].bit0`：允许触发；置 1 后相机开始准备。
- Trigger `DataOut[0].bit1`：上升沿触发一次拍照。
- Results Ack `DataOut[0].bit2`：PLC 已取走结果。
- Clear Error `DataOut[1].bit7`：清除故障，恢复触发。

**相机 → PLC（输入映像区）**

- Trigger Ready `DataIn[2].bit0`：相机就绪，可以发触发。
- Trigger Ack `DataIn[2].bit1`：相机已接收触发。
- Acquiring `DataIn[2].bit2`：正在取图。
- Decoding `DataIn[2].bit3`：正在解码。
- Results OK `DataIn[3].bit0`：读到码，结果在 `DataIn[20]` 起。
- Results NG `DataIn[3].bit1`：没读到码，结果区清零。
- General Fault `DataIn[3].bit7`：相机内部异常，需要清错。

> 使能 NoRead 时没读到码，相机回的是 **Results OK + `NoRead` 字符**；关掉 NoRead 才是 Results NG。PLC 的判断逻辑要分工况写，否则会把没读到当成读到了。

## 三、按这个顺序走一遍

1. 监视表里把显示格式切成 **Binary**。
2. 把 `DataOut[0].bit0` 置 1，等 `DataIn[2].bit0` 变成 1。
3. 给 `DataOut[0].bit1` 一个上升沿，观察 `DataIn[2]` 的 bit1～bit3 依次动作。
4. `DataIn[3]` 出现 Result OK 后，切换成 **ASCII**，从 `DataIn[20]` 起读条码。
5. 置 `DataOut[0].bit2` 发 Results Ack，确认相机清掉结果、Trigger Ready 重新变 1。
6. 出现 General Fault 时，先查相机侧报错原因，再发 Clear Error。

第二轮触发要等第一次 Results Ack 之后，否则相机还在等确认，新的 Trigger 会被忽略。

## 四、常见问题怎么查

| 现象 | 先查什么 |
| --- | --- |
| 相机无法被正常触发 | 通讯连接是否正常；相机是否报错；第二次触发时复位信号（Results Ack）有没有给出 |
| 相机报错 | 连着客户端时有没有开取流；不连客户端运行时有没有开自动工作使能；输出格式化内容有没有配 |
| 状态位正常、结果区没有条码 | 输出格式化标志里有没有写 `<code_content>` |
| 通讯连接异常 | EIP 的设备名是否对应；两侧数据长度是否相同；EDS 文件是否最新；相机固件是否最新 |

第二轮触发要等第一次 Results Ack 之后，否则相机还在等确认，新的 Trigger 会被忽略。

相机侧设置见 [EtherNet/IP 相机侧配置（IDMVS）](#/article/eip-camera-config)，PLC 侧见 [EtherNet/IP PLC 侧配置（欧姆龙 NX 系列）](#/article/eip-omron-nx-setup)，映像区逐字节定义见 [EtherNet/IP 通讯总览与硬件连接](#/article/eip-overview-hardware)。

---

本文依据海康机器人《工业读码器 EtherNet/IP 通讯协议》（2022/2 版）整理，示例设备为欧姆龙 NX102-9000。
