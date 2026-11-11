---
title: EtherNet/IP 通讯总览与硬件连接
summary: "EIP 的接线只有一种：PLC 接交换机、交换机接相机。真正要记住的是两个映像区：PLC 写控制位，相机回状态和条码，各 200 字节。"
tags: [EtherNet/IP, EIP, 通讯协议, 硬件连接, 映像区]
level: 入门
updated: 2026-11-11
order: 7
---

# EtherNet/IP 通讯总览与硬件连接

EtherNet/IP 在读码器上的用法不复杂：相机和 PLC 各开一块内存，PLC 改控制位触发拍照，相机把状态和条码写回另一块内存。把这两块内存弄清楚，接线和配置都是照着填。

## 一、EtherNet/IP 是什么

EtherNet/IP 由罗克韦尔自动化开发、ODVA 管理，是通用工业协议 CIP 的一部分，跑在标准以太网上，面向工业环境里对时间要求比较苛刻的应用。

落到读码器身上，它只做三件事：给相机分配 IP、把控制位送到相机、把状态和条码送回 PLC。和 Profinet 最大的区别在组态方式：EIP 用 EDS 文件描述设备，Profinet 用 GSD，两种文件不能混用。

## 二、接线：PLC、交换机、相机

![EtherNet/IP 接线：PLC 与多台 ID 系列读码器经工业交换机互联](/images/communication/eip-overview-hardware/fig-01-topology.svg)

- PLC 和读码器都接在工业交换机上，用标准网线。
- 相机的 IP 与 PLC 的 IP 必须在同一网段，并且能互相 ping 通。
- 一台 PLC 可以带多台读码器；相机多时按交换机端口分配，不要串成一串。
- 只有一台相机时，也可以直接插在 PLC 的 EIP 网口上，省掉交换机。

欧姆龙 NX102 这类控制器有两个 EIP 口（PORT1、PORT2），插哪个就在软件里配哪个口的 IP。

## 三、两个映像区

相机在 EIP 里暴露两块内存，方向相反：

| 映像区 | 方向 | 装什么 |
| --- | --- | --- |
| 输入映像区 | 相机 → PLC | 相机状态位、条码内容 |
| 输出映像区 | PLC → 相机 | 控制位、用户数据 |

两块默认都是 **200 字节**，大小可以改，但相机和 PLC 两侧必须改成同一个值。

> 有的资料把输出映像区也写成「由相机发送到 PLC」，方向是反的。输出区是 PLC 写、相机读。

## 四、输入映像区：相机回给 PLC 什么

| 字节 | 内容 |
| --- | --- |
| 0–1 | useful data length（本次有效数据长度） |
| 2 | bit0 Trigger Ready、bit1 Trigger Ack、bit2 Acquiring、bit3 Decoding |
| 3 | bit0 Result OK、bit1 Result NG、bit2 Command Complete、bit3 Command Failed、bit7 General Fault |
| 4–17 | 保留 |
| 18–19 | Result Length（条码长度） |
| 20–199 | Result Data 0…179（条码内容） |

读结果时先看 Byte 3 的 Result OK / Result NG，再从 Byte 20 起按长度取字符。Byte 2 那四位是过程信号，用来看相机是在拍照还是在解码。

## 五、输出映像区：PLC 怎么控制相机

| 字节 | 内容 |
| --- | --- |
| 0 | bit0 Trigger Enable、bit1 Trigger、bit2 Results Ack |
| 1 | bit0 Execute Command、bit7 Clear Error |
| 2–17 | 保留 |
| 18–19 | User Data Length |
| 20–199 | User Data 0…179（预留） |

顺序是：先把 Trigger Enable 置 1，等相机回 Trigger Ready；再发 Trigger；读完结果发 Results Ack；相机报错时用 Clear Error 清。完整时序见 [EtherNet/IP 通讯测试：监视、触发与握手时序](#/article/eip-comm-test-handshake)。

## 六、动手前对一遍

- 相机固件 V2.3.0 及以上，型号支持 EtherNet/IP。
- EDS 文件用 2021/10/14 及以后的版本。
- 相机与 PLC 同网段，能 ping 通。
- 两侧输入 / 输出组件都是 200 字节，或都改成同一个值。
- 用 PLC 触发时，相机触发源选软触发；用管脚触发则选对应管脚。
- 参数配完保存用户参数，重新上电才不会丢。

相机侧怎么配见 [EtherNet/IP 相机侧配置（IDMVS）](#/article/eip-camera-config)，PLC 侧见 [EtherNet/IP PLC 侧配置（欧姆龙 NX 系列）](#/article/eip-omron-nx-setup)。

---

本文整理自海康机器人《工业读码器 EthernetIP 通讯协议》培训资料（2022/2），示例设备为欧姆龙 NX102-9000。
