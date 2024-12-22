import React, { useEffect, useState } from "react";
import logo1 from "../../assets/logo5.png";
import logo2 from "../../assets/logo4.png";
import logo3 from "../../assets/logo2.png";
import { FaArrowLeft, FaCheckCircle, FaCopy } from "react-icons/fa";
import useZustand from "../../zustand/useZustand";
import { useLocation, useNavigate } from "react-router-dom";

const bankAccounts = [
    { id: 1, name: "Commercial Bank", account: "1000537602329", img: logo1 },
    { id: 2, name: "Telebirr", account: "0907702898", img: logo2 },
    { id: 3, name: "Awash Bank", account: "013200559831700", img: logo3 },
];


export default function BuyTicket() {
    const navigate = useNavigate()
    const location = useLocation();
    const { totalTicket = 0, totalMoney = 0, selectedService = [] } = location.state || {};
    const [selectedBank, setSelectedBank] = useState(bankAccounts[0]);
    const [phone, setPhone] = useState("");
    const [imgFile, setImgFile] = useState(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");
    const { movieBatch, username, chatID } = useZustand();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => setError(""), 2000);
            return () => clearTimeout(timeout);
        }
    }, [error]);

    const handleReceiptUpload = (event) => {
        const file = event.target.files[0];
        setImgFile(file);
    };

    const handleSubmit = async () => {
        if (!phone || !imgFile) {
            setError("All fields are required");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData()
            formData.append("movie_batch", movieBatch)
            formData.append("phone", phone)
            formData.append("selectedBank", selectedBank.name)
            formData.append("receipt", imgFile) // Send the image file directly
            formData.append("TelegramUsername", username)
            formData.append("selectedService", JSON.stringify(selectedService))
            formData.append("total", totalMoney)
            formData.append("totalTicket", totalTicket)
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await fetch("/api/ticket/BuyTicket", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data) {
                navigate("/ticketSuccsuss")
            }
        } catch (error) {
            setError(error.message || "Failed to submit receipt");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (accountNumber) => {
        navigator.clipboard.writeText(accountNumber)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
            })
            .catch((err) => console.error("Failed to copy:", err));
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg">
                <div
                    onClick={() => navigate(-1)}
                    className="z-10 gap-2 flex items-center text-white bg-slate-800 font-semibold p-3 py-2 rounded-2xl text-xl cursor-pointer"
                    role="button"
                    tabIndex={0}
                >
                    <FaArrowLeft /> Back
                </div>
                <h1
                    className="text-3xl bg-gradient-to-r from-yellow-400 to-red-400 font-bold bg-clip-text text-transparent text-center mb-4">
                    Buy Your Ticket
                </h1>
                <div className="text-gray-400 text-sm">
                    <div className="flex justify-between">
                        <p>Total Tickets: {totalTicket}</p>
                        <p>{totalTicket} X 100 = ETB {totalTicket * 100}</p>
                    </div>

                    {selectedService.length > 0 &&
                        selectedService.map((service, index) => (
                            <div key={index} className="flex justify-between">
                                <p>{service.name}:</p>
                                <p>{service.amount} X {service.prize} = ETB {service.amount * service.prize}</p>
                            </div>
                        ))}

                    <div className="flex border text-white text-lg border-white border-x-0 border-b-0 pt-3 mt-3 justify-end">
                        <p>ETB {totalMoney}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent font-medium mb-2">
                        Select a Bank
                    </p>
                    <div className="flex gap-2">
                        {bankAccounts.map((bank) => (
                            <button
                                key={bank.id}
                                type="button"
                                onClick={() => setSelectedBank(bank)}
                                className={`py-2 px-4 flex-1 rounded-lg text-center transition ${selectedBank.id === bank.id
                                    ? "bg-gray-500 text-gray-900"
                                    : "bg-gray-700 text-yellow-200 hover:bg-gray-600"
                                    }`}
                                aria-label={`Select ${bank.name}`}
                            >
                                <img src={bank.img} alt={`${bank.name} logo`} className="w-10 h-10 mx-auto" />
                            </button>
                        ))}
                    </div>
                    {selectedBank && (
                        <div className="mt-2 flex text-sm items-center justify-between px-2 bg-gray-700 p-2 rounded-lg">
                            <div className="flex items-center gap-4">
                                <img
                                    src={selectedBank.img}
                                    alt={`${selectedBank.name} logo`}
                                    className="w-10 h-10 object-contain rounded-lg"
                                />
                                <div>
                                    <p className="text-yellow-300 bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent font-medium">{selectedBank.name}</p>
                                    <p className="text-yellow-400">{selectedBank.account}</p>
                                </div>
                            </div>

                            <div
                                onClick={() => handleCopy(selectedBank.account)}
                                className="p-2 text-xl bg-slate-600 rounded-xl cursor-pointer"
                                aria-label="Copy account number"
                            >
                                {copied ? (
                                    <div className="text-[11px] flex gap-1 text-yellow-300 items-center"> Copied<FaCheckCircle className="text-yellow-300 text-sm" /></div>
                                ) : (
                                    <FaCopy className="text-yellow-300" />
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {error && (<div className="text-red-500 text-start text-sm">{error}</div>)}

                {/* Receipt Upload */}
                <div className="mb-3 flex items-center gap-4">
                    <div className="flex-1">
                        <label htmlFor="receipt" className="block bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent font-medium mb-2">
                            Bank Receipt
                        </label>
                        <input
                            id="receipt"
                            type="file"
                            accept="image/*"
                            onChange={handleReceiptUpload}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => document.getElementById("receipt").click()}
                            className={`py-2 px-4 ${imgFile ? "text-sm" : ""
                                } bg-gray-700 text-yellow-200 rounded-lg border border-dashed border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition w-full`}
                            aria-label="Upload receipt"
                        >
                            {imgFile ? "Change Receipt" : "Upload Here"}
                        </button>
                    </div>
                    {imgFile && (
                        <img
                            src={URL.createObjectURL(imgFile)}
                            alt="Uploaded Receipt"
                            className="w-32 h-20 object-cover rounded-lg border border-yellow-400"
                        />
                    )}
                </div>

                {/* Phone Input */}
                <div className="mb-3">
                    <label htmlFor="phone" className="block bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent font-medium mb-2">
                        Phone Number
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 py-3 bg-gray-700 text-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-400"
                        placeholder="Enter your phone number"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="w-full bg-gradient-to-r from-yellow-400 to-red-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg transition duration-300"
                >
                    {loading ? "Loading..." : "Submit Receipt"}
                </button>

                <p className="text-xs text-center text-gray-500 mt-6">
                    Need help? Contact us on Telegram <a href="https://t.me/nahom_hab" className="text-yellow-300">@nahom_hab</a> if you haven’t received your ticket.
                </p>
            </div>
        </div>
    );
}