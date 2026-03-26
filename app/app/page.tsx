"use client";

import { useChat } from "@ai-sdk/react";
import {
	DefaultChatTransport,
	lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useStickToBottom } from "use-stick-to-bottom";
import type { ChatAgentUIMessage } from "@/lib/agents/chat-agent";

function ThinkingIndicator({ state }: { state: "streaming" | "done" }) {
	const [elapsed, setElapsed] = useState(0);
	const startRef = useRef(Date.now());

	useEffect(() => {
		if (state !== "streaming") return;
		const interval = setInterval(() => {
			setElapsed(Math.round((Date.now() - startRef.current) / 1000));
		}, 1000);
		return () => clearInterval(interval);
	}, [state]);

	if (state === "streaming") {
		return (
			<span className="text-[12px] text-gray-400">
				Thinking{elapsed > 0 ? ` ${elapsed}s` : ""}
			</span>
		);
	}

	return (
		<span className="text-[12px] text-gray-400">
			Thought for {elapsed}s
		</span>
	);
}

const storefrontProducts = [
	{
		title: "Summer Dress",
		price: "$34.99",
		image_url:
			"https://m.media-amazon.com/images/I/71zHUGwxycL._AC_UL1500_.jpg",
	},
	{
		title: "Running Shoes",
		price: "$89.99",
		image_url:
			"https://m.media-amazon.com/images/I/71eU9Gcf8tL._AC_UL1500_.jpg",
	},
	{
		title: "Gold Earrings",
		price: "$289.99",
		image_url:
			"https://m.media-amazon.com/images/I/71eqYgVdp5L._AC_UL1500_.jpg",
	},
	{
		title: "Hoodie",
		price: "$19.99",
		image_url:
			"https://m.media-amazon.com/images/I/71XLppQqzCL._AC_UL1500_.jpg",
	},
];

function StatusBar() {
	const [time, setTime] = useState("");
	const [batteryLevel, setBatteryLevel] = useState<number | null>(1);
	const [charging, setCharging] = useState<boolean | null>(false);

	useEffect(() => {
		const update = () => {
			const now = new Date();
			setTime(
				now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
			);
		};
		update();
		const id = setInterval(update, 1000);
		return () => clearInterval(id);
	}, []);

	useEffect(() => {
		const nav = navigator as Navigator & {
			getBattery?: () => Promise<{
				level: number;
				charging: boolean;
				addEventListener: (type: string, cb: () => void) => void;
				removeEventListener: (type: string, cb: () => void) => void;
			}>;
		};
		if (!nav.getBattery) {
			return;
		}
		let battery: Awaited<ReturnType<NonNullable<typeof nav.getBattery>>>;
		let levelHandler: () => void;
		let chargingHandler: () => void;
		nav.getBattery().then((b) => {
			battery = b;
			setBatteryLevel(b.level);
			setCharging(b.charging);
			levelHandler = () => setBatteryLevel(b.level);
			chargingHandler = () => setCharging(b.charging);
			b.addEventListener("levelchange", levelHandler);
			b.addEventListener("chargingchange", chargingHandler);
		});
		return () => {
			if (battery) {
				if (levelHandler)
					battery.removeEventListener("levelchange", levelHandler);
				if (chargingHandler)
					battery.removeEventListener("chargingchange", chargingHandler);
			}
		};
	}, []);

	const bLevel = batteryLevel ?? 1;
	const bCharging = charging === true;

	const ready = time !== "" && batteryLevel !== null;

	return (
		<div
			className="flex items-center justify-between px-8 pt-2 pb-1 text-[13px] font-semibold text-black h-[34px] select-none"
			style={{ visibility: ready ? "visible" : "hidden" }}
		>
			<span>{time}</span>
			<div className="flex items-center gap-[5px]">
				{/* Cellular - SF Symbol */}
				<svg width="17" height="12" viewBox="0 0 25.2051 16.9629">
					<path
						d="M21.4648 16.9531L23.8281 16.9531C24.4434 16.9531 24.8438 16.5234 24.8438 15.8887L24.8438 1.06445C24.8438 0.429688 24.4434 0 23.8281 0L21.4648 0C20.8496 0 20.4395 0.429688 20.4395 1.06445L20.4395 15.8887C20.4395 16.5234 20.8496 16.9531 21.4648 16.9531Z"
						fill="currentColor"
					/>
					<path
						d="M14.6484 16.9531L17.002 16.9531C17.6172 16.9531 18.0273 16.5234 18.0273 15.8887L18.0273 4.92188C18.0273 4.28711 17.6172 3.85742 17.002 3.85742L14.6484 3.85742C14.043 3.85742 13.623 4.28711 13.623 4.92188L13.623 15.8887C13.623 16.5234 14.043 16.9531 14.6484 16.9531Z"
						fill="currentColor"
					/>
					<path
						d="M7.8418 16.9531L10.1953 16.9531C10.8105 16.9531 11.2207 16.5234 11.2207 15.8887L11.2207 8.45703C11.2207 7.82227 10.8105 7.39258 10.1953 7.39258L7.8418 7.39258C7.22656 7.39258 6.81641 7.82227 6.81641 8.45703L6.81641 15.8887C6.81641 16.5234 7.22656 16.9531 7.8418 16.9531Z"
						fill="currentColor"
					/>
					<path
						d="M1.02539 16.9531L3.37891 16.9531C3.99414 16.9531 4.4043 16.5234 4.4043 15.8887L4.4043 11.5039C4.4043 10.8691 3.99414 10.4492 3.37891 10.4492L1.02539 10.4492C0.410156 10.4492 0 10.8691 0 11.5039L0 15.8887C0 16.5234 0.410156 16.9531 1.02539 16.9531Z"
						fill="currentColor"
					/>
				</svg>
				{/* WiFi - SF Symbol */}
				<svg width="16" height="12" viewBox="0 0 22.8448 16.2402">
					<path
						d="M1.4761 6.8457C1.67141 7.03125 1.94485 7.03125 2.13039 6.83594C4.53274 4.28711 7.6968 2.93945 11.2417 2.93945C14.8062 2.93945 17.9898 4.29688 20.3726 6.8457C20.5484 7.02148 20.812 7.01172 21.0073 6.82617L22.355 5.47852C22.5308 5.30273 22.521 5.08789 22.3843 4.92188C20.0894 2.08984 15.773 0.00976562 11.2417 0.00976562C6.72024 0.00976562 2.3843 2.08984 0.0991432 4.92188C-0.0375756 5.08789-0.0375756 5.30273 0.12844 5.47852Z"
						fill="currentColor"
					/>
					<path
						d="M5.52883 10.9277C5.74367 11.1328 6.00735 11.1035 6.20266 10.8887C7.37453 9.58984 9.2886 8.64258 11.2417 8.65234C13.2144 8.64258 15.1284 9.61914 16.3198 10.918C16.4956 11.123 16.7398 11.1133 16.9546 10.918L18.4683 9.41406C18.6245 9.25781 18.6441 9.04297 18.4976 8.86719C17.023 7.06055 14.2886 5.70312 11.2417 5.70312C8.19485 5.70312 5.46047 7.06055 3.98586 8.86719C3.83938 9.04297 3.84914 9.23828 4.01516 9.41406Z"
						fill="currentColor"
					/>
					<path
						d="M11.2417 16.2402C11.4566 16.2402 11.6421 16.1426 12.023 15.7715L14.4058 13.4863C14.5523 13.3398 14.5913 13.125 14.4546 12.9492C13.8198 12.1289 12.6187 11.416 11.2417 11.416C9.82571 11.416 8.62453 12.1582 7.98977 13.0078C7.89211 13.1641 7.93117 13.3398 8.08742 13.4863L10.4605 15.7715C10.8413 16.1328 11.0269 16.2402 11.2417 16.2402Z"
						fill="currentColor"
					/>
				</svg>
				{/* Battery - SF Symbol */}
				{bCharging ? (
					<svg width="29" height="15" viewBox="0 0 29.2676 15.8871">
						<path
							d="M11.5758 2.90939L4.9707 2.90939C3.94531 2.90939 2.88086 3.03635 2.28516 3.63205C1.69922 4.22775 1.57227 5.27268 1.57227 6.29807L1.57227 9.60861C1.57227 10.6145 1.69922 11.6594 2.28516 12.2551C2.88086 12.841 3.93555 12.9778 4.94141 12.9778L9.72242 12.9778L9.57031 13.3879C9.41396 13.8103 9.40031 14.2052 9.49039 14.55L5.20508 14.55C3.54492 14.55 2.13867 14.3938 1.14258 13.3977C0.146484 12.4016 0 11.0149 0 9.34494L0 6.51291C0 4.88205 0.146484 3.48557 1.14258 2.48947C2.13867 1.49338 3.54492 1.33713 5.18555 1.33713L12.8268 1.33713ZM24.6289 2.48947C25.625 3.48557 25.7715 4.87228 25.7715 6.54221L25.7715 9.34494C25.7715 11.0149 25.625 12.4016 24.6289 13.3977C23.6328 14.3938 22.2266 14.55 20.5566 14.55L13.1791 14.55L14.43 12.9778L20.8301 12.9778C21.8359 12.9778 22.8906 12.841 23.4766 12.2551C24.0723 11.6594 24.1992 10.6145 24.1992 9.60861L24.1992 6.26877C24.1992 5.26291 24.0723 4.22775 23.4766 3.63205C22.8906 3.04611 21.8359 2.90939 20.8301 2.90939L16.2834 2.90939L16.4355 2.49924C16.5919 2.07689 16.6055 1.68198 16.5155 1.33713L20.5566 1.33713C22.2266 1.33713 23.6328 1.49338 24.6289 2.48947ZM28.9062 7.93869C28.9062 9.43283 27.8711 10.4192 27.0996 10.468L27.0996 5.41916C27.8711 5.46799 28.9062 6.45432 28.9062 7.93869Z"
							fill="currentColor"
						/>
						<path
							d="M7.93945 7.47971C7.65625 7.83127 7.49023 8.24143 7.49023 8.68088C7.49023 9.65744 8.29102 10.4387 9.27734 10.4387L10.6641 10.4387L10.1425 11.8449L4.42383 11.8449C3.75977 11.8449 3.35938 11.7473 3.08594 11.4738C2.8125 11.2004 2.71484 10.8098 2.71484 10.136L2.71484 5.77072C2.71484 5.08713 2.8125 4.68674 3.08594 4.4133C3.34961 4.13986 3.75 4.04221 4.45312 4.04221L10.6745 4.04221ZM22.6855 4.4133C22.9492 4.68674 23.0566 5.07736 23.0566 5.75119L23.0566 10.136C23.0566 10.8098 22.9492 11.2004 22.6855 11.4738C22.4121 11.7473 22.0215 11.8449 21.3477 11.8449L15.3314 11.8449L18.0664 8.40744C18.3496 8.05588 18.5156 7.64572 18.5156 7.20627C18.5156 6.22971 17.7148 5.44846 16.7285 5.44846L15.3418 5.44846L15.8633 4.04221L21.3477 4.04221C22.0117 4.04221 22.4121 4.13986 22.6855 4.4133Z"
							fill="currentColor"
						/>
						<path
							d="M8.81836 8.68088C8.81836 8.92502 9.01367 9.1008 9.26758 9.1008L12.5781 9.1008L10.8105 13.8469C10.5859 14.4719 11.25 14.8137 11.6504 14.3156L17.002 7.58713C17.0996 7.46018 17.168 7.33322 17.168 7.20627C17.168 6.96213 16.9727 6.78635 16.7188 6.78635L13.4082 6.78635L15.1758 2.04025C15.4004 1.41525 14.7363 1.07346 14.3359 1.5715L8.98438 8.29025C8.87695 8.42697 8.81836 8.55393 8.81836 8.68088Z"
							fill="currentColor"
						/>
					</svg>
				) : (
					<svg width="29" height="13" viewBox="0 0 29.2676 13.2129">
						<defs>
							<clipPath id="battery-clip">
								<rect x="2.71" y="2.7" width={20.35 * bLevel} height="7.81" />
							</clipPath>
						</defs>
						<path
							d="M5.20508 13.2129L20.5566 13.2129C22.2266 13.2129 23.6328 13.0566 24.6289 12.0605C25.625 11.0645 25.7715 9.67773 25.7715 8.00781L25.7715 5.20508C25.7715 3.53516 25.625 2.14844 24.6289 1.15234C23.6328 0.15625 22.2266 0 20.5566 0L5.18555 0C3.54492 0 2.13867 0.15625 1.14258 1.15234C0.146484 2.14844 0 3.54492 0 5.17578L0 8.00781C0 9.67773 0.146484 11.0645 1.14258 12.0605C2.13867 13.0566 3.54492 13.2129 5.20508 13.2129ZM4.94141 11.6406C3.93555 11.6406 2.88086 11.5039 2.28516 10.918C1.69922 10.3223 1.57227 9.27734 1.57227 8.27148L1.57227 4.96094C1.57227 3.93555 1.69922 2.89062 2.28516 2.29492C2.88086 1.69922 3.94531 1.57227 4.9707 1.57227L20.8301 1.57227C21.8359 1.57227 22.8906 1.70898 23.4766 2.29492C24.0723 2.89062 24.1992 3.92578 24.1992 4.93164L24.1992 8.27148C24.1992 9.27734 24.0723 10.3223 23.4766 10.918C22.8906 11.5039 21.8359 11.6406 20.8301 11.6406ZM27.0996 9.13086C27.8711 9.08203 28.9062 8.0957 28.9062 6.60156C28.9062 5.11719 27.8711 4.13086 27.0996 4.08203Z"
							fill="currentColor"
						/>
						<path
							d="M4.42383 10.5078L21.3477 10.5078C22.0215 10.5078 22.4121 10.4102 22.6855 10.1367C22.9492 9.86328 23.0566 9.47266 23.0566 8.79883L23.0566 4.41406C23.0566 3.74023 22.9492 3.34961 22.6855 3.07617C22.4121 2.80273 22.0117 2.70508 21.3477 2.70508L4.45312 2.70508C3.75 2.70508 3.34961 2.80273 3.08594 3.07617C2.8125 3.34961 2.71484 3.75 2.71484 4.43359L2.71484 8.79883C2.71484 9.47266 2.8125 9.86328 3.08594 10.1367C3.35938 10.4102 3.75977 10.5078 4.42383 10.5078Z"
							fill={bLevel <= 0.2 ? "#ff3b30" : "currentColor"}
							clipPath="url(#battery-clip)"
						/>
					</svg>
				)}
			</div>
		</div>
	);
}

function SearchBar() {
	return (
		<div
			className="px-3 py-3 select-none"
			style={{
				background: "linear-gradient(180deg, #9ae4df 0%, #b5ece8 100%)",
			}}
		>
			<div className="flex items-center bg-white rounded-lg px-3 py-2.5 shadow-sm">
				<svg
					className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.35-4.35" strokeLinecap="round" />
				</svg>
				<span className="text-[15px] text-gray-400 flex-1 truncate">
					what are the differences between tra...
				</span>
				<div className="flex items-center gap-2 ml-2 flex-shrink-0">
					{/* Camera icon */}
					<svg
						className="w-[22px] h-[22px] text-gray-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1.5}
					>
						<path
							d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.802.024-1.644-.036a.834.834 0 01-.765-.833V5.057c0-.865.702-1.567 1.567-1.567h.696c.343 0 .656.14.881.367M17.173 6.175A2.31 2.31 0 0118.814 7.23c.38.054.802.024 1.644-.036a.834.834 0 00.765-.833V5.057c0-.865-.702-1.567-1.567-1.567h-.696a1.25 1.25 0 00-.881.367"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<rect
							x="3"
							y="7"
							width="18"
							height="13"
							rx="2"
							strokeLinecap="round"
						/>
						<circle cx="12" cy="13.5" r="3.5" />
					</svg>
					{/* Mic icon */}
					<svg
						className="w-[22px] h-[22px] text-gray-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1.5}
					>
						<rect x="9" y="2" width="6" height="11" rx="3" />
						<path
							d="M5 11a7 7 0 0014 0M12 18v3m-3 0h6"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
			</div>
		</div>
	);
}

function StorefrontGrid() {
	return (
		<div className="bg-white px-3 py-3">
			{/* Category pills */}
			<div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
				{["Today's Deals", "Fashion", "Electronics", "Home", "Beauty"].map(
					(cat) => (
						<span
							key={cat}
							className="text-[12px] px-3 py-1.5 bg-white border border-gray-300 rounded-full whitespace-nowrap text-gray-700"
						>
							{cat}
						</span>
					),
				)}
			</div>
			{/* Product grid */}
			<div className="grid grid-cols-2 gap-2">
				{storefrontProducts.map((p, i) => (
					<div
						key={i}
						className="bg-gray-50 rounded-lg p-2 flex flex-col items-center"
					>
						<div className="w-full h-24 relative mb-1.5">
							<Image
								src={p.image_url}
								alt={p.title}
								fill
								className="object-contain"
								sizes="180px"
							/>
						</div>
						<p className="text-[11px] text-gray-800 text-center leading-tight">
							{p.title}
						</p>
						<p className="text-[12px] font-bold text-gray-900 mt-0.5">
							{p.price}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

function ProductCard({
	product,
}: {
	product: {
		id: string;
		title: string;
		description: string;
		price: number;
		image_url: string;
		average_rating: number;
		store: string;
	};
}) {
	return (
		<div className="border border-gray-200 rounded-xl overflow-hidden">
			<div className="flex items-center p-3 gap-3">
				<div className="w-16 h-16 relative flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
					<Image
						src={product.image_url}
						alt={product.title}
						fill
						className="object-contain p-1"
						sizes="64px"
					/>
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-[11px] text-gray-500">Search</p>
					<p className="text-[14px] font-semibold text-gray-900 leading-tight truncate">
						{product.title}
					</p>
				</div>
				<svg
					className="w-4 h-4 text-gray-400 flex-shrink-0"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
				>
					<path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
			<div className="px-3 pb-3">
				<p className="text-[13px] text-gray-700 leading-relaxed line-clamp-2">
					{product.description}
				</p>
			</div>
		</div>
	);
}


function ChatPanel() {
	const [input, setInput] = useState("");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

	const handleImageFile = (file: File) => {
		if (allowedTypes.includes(file.type)) {
			setImageFile(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};
	const { scrollRef, contentRef } = useStickToBottom();

	const { messages, sendMessage, addToolOutput, status } =
		useChat<ChatAgentUIMessage>({
			transport: new DefaultChatTransport({ api: "/api/chat" }),
			sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
			onError: (error) => {
			toast.error(error.message || "Something went wrong. Please try again.", {
				duration: Infinity,
			});
		},
	});

	const isLoading = status === "streaming";

	const pendingShowOptions = (() => {
		const last = [...messages].reverse().find((m) => m.role === "assistant");
		if (!last) return null;
		for (const part of last.parts) {
			if (
				part.type === "tool-showOptions" &&
				part.state === "input-available"
			) {
				return part.toolCallId;
			}
		}
		return null;
	})();

	return (
		<div className="absolute bottom-[54px] left-0 right-0 top-[85px] flex flex-col bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.12)] z-10">
			{/* Drag handle + header */}
			<div className="flex flex-col items-center pt-2 pb-1 border-b border-gray-100">
				<div className="w-10 h-1 bg-gray-300 rounded-full mb-2" />
				<div className="flex items-center justify-between w-full px-4 pb-1">
					<div className="w-8" />
					<div className="flex items-center gap-1">
						<span className="text-[15px] font-semibold text-gray-900">
							Fufus
						</span>
						<span className="text-[10px] text-gray-400 mt-0.5">beta</span>
					</div>
					<button className="text-gray-400 text-lg leading-none tracking-widest">
						&bull;&bull;&bull;
					</button>
				</div>
			</div>

			{/* Chat messages */}
			<div
				ref={scrollRef}
				className="flex-1 overflow-y-auto no-scrollbar px-4 py-3"
			>
				<div ref={contentRef} className="space-y-4">
					{messages.length === 0 && (
						<div className="space-y-5 pt-2">
							{/* Welcome card */}
							<div className="border border-gray-200 rounded-xl p-4">
								<p className="text-[15px] font-bold text-gray-900 mb-1">
									Welcome!
								</p>
								<p className="text-[13px] text-gray-600 leading-relaxed">
									Hi, I&apos;m Fufus, your shopping assistant. My answers are
									powered by AI, so I may not always get things right.{" "}
									<span className="text-[#007185] cursor-pointer">
										Learn more
									</span>
								</p>
							</div>

							{/* Keep shopping section */}
							<div>
								<div className="flex items-center gap-2 mb-2.5">
									<div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#f08804] to-[#e65100] flex items-center justify-center flex-shrink-0">
										<svg
											className="w-3.5 h-3.5 text-white"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
										</svg>
									</div>
									<span className="text-[14px] font-bold text-gray-900">
										Keep shopping for electronics
									</span>
								</div>
								<div className="flex flex-col gap-2">
									{[
										"What are the best wireless earbuds under $50?",
										"Which smart home devices work with Alexa?",
										"What's a good portable charger for travel?",
									].map((text) => (
										<button
											key={text}
											onClick={() => sendMessage({ text })}
											className="text-left text-[13px] text-[#0f4c75] bg-[#e8f4f8] rounded-2xl px-4 py-2.5 leading-snug hover:bg-[#d6ecf2] transition-colors cursor-pointer"
										>
											{text}
										</button>
									))}
								</div>
							</div>

							{/* Explore something new section */}
							<div>
								<div className="flex items-center gap-2 mb-2.5">
									<div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#f08804] to-[#e65100] flex items-center justify-center flex-shrink-0">
										<svg
											className="w-3.5 h-3.5 text-white"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
										</svg>
									</div>
									<span className="text-[14px] font-bold text-gray-900">
										Explore something new
									</span>
								</div>
								<div className="flex flex-col gap-2">
									{[
										"What do I need to start a home gym?",
										"Help me find a stylish summer outfit",
										"What are the best kitchen gadgets for beginners?",
									].map((text) => (
										<button
											key={text}
											onClick={() => sendMessage({ text })}
											className="text-left text-[13px] text-[#0f4c75] bg-[#e8f4f8] rounded-2xl px-4 py-2.5 leading-snug hover:bg-[#d6ecf2] transition-colors cursor-pointer"
										>
											{text}
										</button>
									))}
								</div>
							</div>
						</div>
					)}

					{messages.map((message) => (
						<div key={message.id} className="space-y-4">
							{message.role === "user" && (
								<div className="flex items-center gap-2.5">
									<div className="w-6 h-6 rounded-full bg-[#f08804] flex items-center justify-center flex-shrink-0">
										<svg
											className="w-3.5 h-3.5 text-white"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
										</svg>
									</div>
									<div className="space-y-1.5">
										{message.parts
											.filter(
												(p): p is Extract<typeof p, { type: "file" }> =>
													p.type === "file" &&
													!!p.mediaType?.startsWith("image/"),
											)
											.map((p, i) => (
												<div
													key={i}
													className="w-[180px] h-[180px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
												>
													<img
														src={p.url}
														alt={p.filename ?? "uploaded image"}
														className="w-full h-full object-cover"
													/>
												</div>
											))}
										<p className="text-[14px] text-gray-900 leading-snug">
											{message.parts
												.filter((p) => p.type === "text")
												.map((p) => p.text)
												.join("")}
										</p>
									</div>
								</div>
							)}

							{message.role === "assistant" &&
								(() => {
									const isLastMessage = message === messages.at(-1);
									const stillStreaming = isLastMessage && isLoading;
									return (
										<>
											{message.parts.map((part, i) => {
												if (part.type === "step-start") {
													return null;
												}
												if (part.type === "reasoning") {
													// Skip if already rendered in a prior batch
													// Look back past step-start parts to find the real predecessor
													let prev = i - 1;
													while (prev >= 0 && message.parts[prev].type === "step-start") prev--;
													if (
														prev >= 0 &&
														(message.parts[prev].type === "reasoning" ||
														message.parts[prev].type === "tool-searchProducts")
													)
														return null;
													// Collect consecutive reasoning + searchProducts + step-start parts
													const statusParts: React.ReactNode[] = [];
													for (
														let j = i;
														j < message.parts.length;
														j++
													) {
														const p = message.parts[j];
														if (p.type === "reasoning") {
															if (p.text.trim()) {
																statusParts.push(
																	<div key={`r-${j}`}>
																		<ThinkingIndicator state={p.state ?? "done"} />
																	</div>,
																);
															}
														} else if (p.type === "tool-searchProducts") {
															statusParts.push(
																<div key={`s-${j}`}>
																	<span className="text-[12px] text-gray-400">
																		{p.state === "output-available"
																			? `Searched "${p.input?.query ?? "..."}"`
																			: `Searching "${p.input?.query ?? "..."}"`}
																	</span>
																</div>,
															);
														} else if (p.type === "step-start") {
															// skip step-start but continue collecting
														} else {
															break;
														}
													}
													return (
														<div
															key={`${message.id}-part-${i}`}
															className="space-y-0.5"
														>
															{statusParts}
														</div>
													);
												}
												if (
													part.type === "text" &&
													part.text.trim()
												) {
													// Skip text if an earlier part already has identical content
													// (the model may repeat itself across tool-loop steps).
													const earlierDup = message.parts.some(
														(p, j) =>
															j < i &&
															p.type === "text" &&
															p.text.trim() === part.text.trim(),
													);
													if (earlierDup) return null;
													return (
														<div
															key={`${message.id}-part-${i}`}
															className="flex items-start gap-2.5"
														>
															<div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#f08804] to-[#e65100] flex items-center justify-center flex-shrink-0 mt-0.5">
																<svg
																	className="w-3 h-3 text-white"
																	fill="currentColor"
																	viewBox="0 0 24 24"
																>
																	<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
																</svg>
															</div>
															<span className="text-[14px] text-gray-800 leading-relaxed">
																{part.text}
															</span>
														</div>
													);
												}

												if (
													part.type === "tool-searchProducts"
												) {
													// Skip if already rendered in a prior batch
													{
														let prev = i - 1;
														while (prev >= 0 && message.parts[prev].type === "step-start") prev--;
														if (
															prev >= 0 &&
															(message.parts[prev].type === "tool-searchProducts" ||
															message.parts[prev].type === "reasoning")
														)
															return null;
													}
													// Collect consecutive searchProducts parts
													const batch = [part];
													for (
														let j = i + 1;
														j <
														message.parts.length;
														j++
													) {
														if (
															message.parts[j]
																.type ===
															"tool-searchProducts"
														)
															batch.push(
																message.parts[
																	j
																] as typeof part,
															);
														else break;
													}
													return (
														<div
															key={`${message.id}-part-${i}`}
															className="space-y-0.5"
														>
															{batch.map(
																(p, bi) => (
																	<div
																		key={bi}
																	>
																		<span className="text-[12px] text-gray-400">
																			{p.state ===
																			"output-available"
																				? `Searched "${p.input?.query ?? "..."}"`
																				: `Searching "${p.input?.query ?? "..."}"`}
																		</span>
																	</div>
																),
															)}
														</div>
													);
												}

												if (
													part.type ===
														"tool-showProducts" &&
													part.state ===
														"output-available" &&
													!stillStreaming
												) {
													const products =
														part.output as Array<{
															id: string;
															title: string;
															description: string;
															price: number;
															image_url: string;
															average_rating: number;
															store: string;
														}>;
													return (
														<div
															key={`${message.id}-part-${i}`}
															className="space-y-2"
														>
															{products.map(
																(product) => (
																	<ProductCard
																		key={
																			product.id
																		}
																		product={
																			product
																		}
																	/>
																),
															)}
														</div>
													);
												}

												if (
													part.type ===
													"tool-showOptions"
												) {
													const callId =
														part.toolCallId;
													const prevIsText =
														i > 0 &&
														message.parts[i - 1]
															.type === "text";
													const optionsMargin = prevIsText ? " -mt-2" : "";
													const optionsClass = `flex items-start gap-2.5${optionsMargin}`;

													if (
														part.state ===
														"input-available"
													) {
														return (
															<div
																key={`${message.id}-part-${i}`}
																className={optionsClass}
															>
																<div className="w-6 flex-shrink-0" />
																<div className="flex flex-wrap gap-2 min-w-0">
																	{part.input.options.map(
																		(
																			option: string,
																		) => (
																			<button
																				key={
																					option
																				}
																				onClick={() =>
																					addToolOutput(
																						{
																							tool: "showOptions",
																							toolCallId:
																								callId,
																							output: option,
																						},
																					)
																				}
																				className="text-left text-[13px] text-[#0f4c75] bg-[#e8f4f8] rounded-2xl px-4 py-2.5 leading-snug hover:bg-[#d6ecf2] transition-colors cursor-pointer"
																			>
																				{
																					option
																				}
																			</button>
																		),
																	)}
																</div>
															</div>
														);
													}

													if (
														part.state ===
														"output-available"
													) {
														const selected =
															part.output as string;
														const isCustomResponse =
															!part.input.options.includes(
																selected,
															);
														return (
															<div
																key={`${message.id}-part-${i}`}
																className={optionsClass}
															>
																<div className="w-6 flex-shrink-0" />
																<div className="flex flex-wrap gap-2 min-w-0">
																	{part.input.options.map(
																		(
																			option: string,
																		) => (
																			<span
																				key={
																					option
																				}
																				className={`text-[13px] rounded-2xl px-4 py-2.5 leading-snug transition-colors ${
																					option ===
																					selected
																						? "bg-[#0f4c75] text-white font-medium"
																						: "bg-gray-100 text-gray-400"
																				}`}
																			>
																				{
																					option
																				}
																			</span>
																		),
																	)}
																	{isCustomResponse && (
																		<span className="text-[13px] rounded-2xl px-4 py-2.5 leading-snug bg-[#0f4c75] text-white font-medium">
																			{
																				selected
																			}
																		</span>
																	)}
																</div>
															</div>
														);
													}
												}

												return null;
											})}
										</>
									);
								})()}
						</div>
					))}
				</div>
			</div>

			{/* Chat input */}
			<div className="px-4 py-2 border-t border-gray-100">
				{imagePreview && (
					<div className="mb-2 relative inline-block w-16 h-16">
						<img
							src={imagePreview}
							alt="preview"
							className="w-full h-full object-cover rounded-lg"
						/>
						<button
							type="button"
							onClick={() => {
								setImageFile(null);
								setImagePreview(null);
								if (fileInputRef.current) fileInputRef.current.value = "";
							}}
							className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 text-white rounded-full flex items-center justify-center text-[11px] leading-none"
						>
							&times;
						</button>
					</div>
				)}
				<input
					ref={fileInputRef}
					type="file"
					accept="image/jpeg,image/png,image/gif,image/webp"
					className="hidden"
					onChange={(e) => {
						const file = e.target.files?.[0];
						if (file) handleImageFile(file);
					}}
				/>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						if (isLoading) return;
						const hasText = input.trim().length > 0;
						const hasImage = !!imageFile;
						if (!hasText && !hasImage) return;
						const text = hasText ? input.trim() : "";
						if (pendingShowOptions && hasText && !hasImage) {
							addToolOutput({
								tool: "showOptions",
								toolCallId: pendingShowOptions,
								output: text,
							});
						} else {
							const dt = new DataTransfer();
							if (imageFile) dt.items.add(imageFile);
							sendMessage({ text, files: hasImage ? dt.files : undefined });
						}
						setInput("");
						setImageFile(null);
						setImagePreview(null);
						if (fileInputRef.current) fileInputRef.current.value = "";
					}}
					className="flex items-center border border-gray-300 rounded-full px-4 py-2.5"
				>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="mr-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
						disabled={isLoading}
					>
						<svg
							className="w-5 h-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={1.5}
						>
							<path
								d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.802.024-1.644-.036a.834.834 0 01-.765-.833V5.057c0-.865.702-1.567 1.567-1.567h.696c.343 0 .656.14.881.367M17.173 6.175A2.31 2.31 0 0118.814 7.23c.38.054.802.024 1.644-.036a.834.834 0 00.765-.833V5.057c0-.865-.702-1.567-1.567-1.567h-.696a1.25 1.25 0 00-.881.367"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<rect
								x="3"
								y="7"
								width="18"
								height="13"
								rx="2"
								strokeLinecap="round"
							/>
							<circle cx="12" cy="13.5" r="3.5" />
						</svg>
					</button>
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onPaste={(e) => {
							const file = Array.from(e.clipboardData.items)
								.find((item) => allowedTypes.includes(item.type))
								?.getAsFile();
							if (file) handleImageFile(file);
						}}
						placeholder={
							messages.length === 0
								? "Ask Fufus a question"
								: "Ask a follow-up question"
						}
						className="text-[14px] text-gray-900 flex-1 outline-none bg-transparent placeholder:text-gray-400"
						disabled={isLoading}
					/>
					<button
						type="submit"
						disabled={(!input.trim() && !imageFile) || isLoading}
						className="ml-2 text-[#f08804] disabled:text-gray-300"
					>
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
						</svg>
					</button>
				</form>
			</div>
		</div>
	);
}

function BottomNav() {
	return (
		<div className="absolute bottom-[10px] left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around pt-3 pb-2 z-20">
			{[
				{
					label: "Home",
					icon: (
						<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
						</svg>
					),
					active: true,
				},
				{
					label: "",
					icon: (
						<svg
							className="w-6 h-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={1.5}
						>
							<path
								d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					),
					active: false,
				},
				{
					label: "",
					icon: (
						<svg
							className="w-6 h-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={1.5}
						>
							<path
								d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					),
					active: false,
				},
				{
					label: "",
					icon: (
						<svg
							className="w-6 h-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={1.5}
						>
							<path
								d="M9 22V12h6v10M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					),
					active: false,
				},
				{
					label: "",
					icon: (
						<svg
							className="w-6 h-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={1.5}
						>
							<path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
						</svg>
					),
					active: false,
				},
			].map((item, i) => (
				<button
					key={i}
					className={`flex flex-col items-center gap-0.5 ${item.active ? "text-[#008296]" : "text-gray-500"}`}
				>
					{item.icon}
				</button>
			))}
		</div>
	);
}

export default function Home() {
	return (
		<div className="flex items-center justify-center h-screen bg-white">
			{/* Phone frame */}
			<div
				className="relative bg-white overflow-hidden shadow-2xl flex flex-col"
				style={{
					width: 440,
					height: 956,
					borderRadius: 48,
					boxShadow: "0 0 0 3px #1a1a1a, 0 25px 60px rgba(0,0,0,0.3)",
				}}
			>
				{/* Notch / Dynamic Island */}
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160px] h-[28px] bg-black rounded-b-[22px] z-30" />

				<StatusBar />

				<div className="relative flex-1 min-h-0">
					<SearchBar />
					<StorefrontGrid />
					<ChatPanel />
					<BottomNav />
				</div>
			</div>
		</div>
	);
}
