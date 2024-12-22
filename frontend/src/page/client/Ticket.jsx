import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import img1 from '../../assets/movie1.jpeg';
import chips from '../../assets/chips.png';
import coke from '../../assets/coke.png';
import corn from '../../assets/corn.png';
import useZustand from '../../zustand/useZustand';
import Loading from '../../component/Loading';
import wrap from '../../assets/wrap.png'
import down from '../../assets/download.png'


const service = [
    { id: 1, name: 'SunChips', img: chips, prize: 30, amount: 0 },
    { id: 2, name: 'Coke', img: coke, prize: 50, amount: 0 },
    { id: 3, name: 'Ertib', img: down, prize: 80, amount: 0 },

    { id: 4, name: 'Vegitable wrap', img: wrap, prize: 80, amount: 0 },
];

export default function Ticket() {
    const navigate = useNavigate();
    const [totalTicket, setTotalTicket] = useState(1);
    const [totalMoney, setTotalMoney] = useState(100);
    const [selectedService, setSelectedService] = useState([]);
    const [WinnerMovie, setWinnerMovie] = useState(null)
    const [loading, setLoading] = useState(false)
    const { setting, setSetting } = useZustand()

    const TICKET_PRICE = 100;

    useEffect(() => {
        let tot = selectedService.reduce((sum, data) => sum + (data.amount * data.prize), 0);
        setTotalMoney(tot + totalTicket * TICKET_PRICE);
    }, [totalTicket, selectedService]);

    const handleAddService = (service) => {
        const existingService = selectedService.find((item) => item.id === service.id);
        if (existingService) {
            setSelectedService(selectedService.filter((item) => item.id !== service.id));
        } else {
            setSelectedService([...selectedService, { ...service, amount: 1 }]);
        }
    };
    useEffect(() => {
        const fetchWinner = async () => {
            try {
                setLoading(true)
                const settingsResponse = await fetch('api/setting/6745808197b958d5b1c26aac');
                if (!settingsResponse.ok) {
                    throw new Error('Failed to fetch settings.');
                }
                const settingsData = await settingsResponse.json();
                setSetting(settingsData)
                const response = await fetch(`/api/movies/getWinner/${settingsData.movie_batch}`);
                const data = await response.json();
                setWinnerMovie(data)
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false)
            }
        }
        fetchWinner()

    }, [])

    const addAmount = (service) => {
        setSelectedService((prevServices) =>
            prevServices.map((item) =>
                item.id === service.id ? { ...item, amount: item.amount + 1 } : item
            )
        );
    };


    const addTicket = () => setTotalTicket((prev) => prev + 1);

    const removeTicket = () => {
        if (totalTicket > 1) setTotalTicket((prev) => prev - 1);
    };
    const handleNavigate = () => {
        navigate('/buyTicket', { state: { totalTicket, totalMoney, selectedService } });
    }



    if (loading) return <Loading />

    return (
        <div className="min-h-screen text-white bg-gray-900">
            <div>
                <div className="flex justify-between px-8 items-center font-semibold p-3 py-2 rounded-2xl text-xl pt-5">
                    <div
                        onClick={() => navigate(-1)}
                        className="z-10 gap-2 flex items-center text-white bg-slate-800 font-semibold p-3 py-2 rounded-2xl text-xl cursor-pointer"
                        role="button"
                        tabIndex={0}
                    >
                        <FaArrowLeft /> Back
                    </div>
                </div>

                <div>
                    {/* <div className="px-10 text-gray-400 mb-2 text-xl mt-2">
                        <span className="text-white">Movie: </span>{WinnerMovie.name}
                    </div> */}
                    <div className="flex justify-center gap-4 w-full">
                        <img src={WinnerMovie?.img || img1} className="w-[40%] object-cover h-40 rounded-2xl" alt="Movie" />
                        <div className="w-[40%] font-bold text-2xl pb-3 bg-gradient-to-r from-yellow-300 to-red-500 bg-clip-text text-transparent">
                            <div className='text-lg text-red-500'>{WinnerMovie?.name || 'loading...'}</div>
                            <div>{setting.Movie_Day}</div>
                            <div>Night</div>
                            <div>at</div>
                            <div>12:00 PM</div>
                        </div>
                    </div>

                    <div className="flex mt-4 items-center justify-between gap-3 px-10">


                        <div
                            onClick={removeTicket}
                            role="button"
                            tabIndex={0}
                            className={`text-black flex justify-center px-3 py-2 rounded-xl bg-gradient-to-r ${totalTicket > 1 ? 'from-red-500 to-yellow-400' : 'bg-transparent text-gray-500'
                                } font-semibold  text-[12px] whitespace-nowrap  shadow-[0_0_5px_5px_rgba(234,179,8,0.6)] cursor-pointer`}
                        >
                            <span className="font-bold text-2xl"></span>
                            <div>Remove</div>
                        </div>
                        <div className='px-2 font-bold text-lg whitespace-nowrap bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent'>Ticket: {totalTicket}</div>


                        <div
                            onClick={addTicket}
                            role="button"
                            tabIndex={0}
                            className="text-center text-black bg-gradient-to-r px-3  py-2 rounded-xl from-yellow-400 to-green-500 font-semibold  text-[12px] whitespace-nowrap  shadow-[0_0_5px_5px_rgba(234,179,8,0.6)] cursor-pointer flex items-center ">
                            <span className="font-bold text-2xl"></span>
                            <div>Add</div>
                        </div>
                    </div>


                    <div className="mt-3">
                        <div className="text-2xl px-8 bg-gradient-to-r from-yellow-400 to-red-400 font-bold bg-clip-text text-transparent pt-2">
                            Our Services At Flame's
                            <div className='text-sm'>Select Services</div>
                        </div>


                        <div className="w-full grid grid-cols-2 gap-6 px-8 pt-5 justify-around">
                            {service.map((item) => {
                                const isSelected = selectedService.find((s) => s.id === item.id);
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => handleAddService(item)}
                                        className={` relative flex  overflow-hidden gap-2 h-20 w-[170px]  ${selectedService.find((s) => s.id === item.id)
                                            ? 'bg-gradient-to-r from-red-500 to-yellow-400'
                                            : ''
                                            } items-center px-3 py-3 rounded-xl shadow-[0_0_2px_2px_rgba(234,179,8,0.6)] cursor-pointer`}
                                    >
                                        <img className={`${item.id === 3 || item.id === 4 ? 'w-20' : 'w-12'} `} src={item.img} alt={item.name} />
                                        <div className="text-lg space-y-2">
                                            <div className={`${item.id === 3 || item.id === 4 ? 'text-sm' : 'text-lg'}`}>{item.name}</div>
                                            <div className="flex gap-2">
                                                <div
                                                    className={`font-bold ${selectedService.find((s) => s.id === item.id)
                                                        ? 'text-white'
                                                        : 'bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent'
                                                        }`}
                                                >
                                                    ETB {item.prize}
                                                </div>
                                                {isSelected && (
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent parent click
                                                            addAmount(item);
                                                        }} className='absolute w-16 flex justify-center items-center h-16 top-[-16px] right-[-16px]'>
                                                        <div

                                                            className="bg-red-500 rounded-full w-9 h-9 flex justify-center items-center"
                                                        >
                                                            <span className="text-white text-sm">+{isSelected.amount}</span>
                                                        </div>
                                                    </div>

                                                )}


                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='px-8 text-gray-200 mt-4 mb-4'>
                        {selectedService.length > 0 &&
                            selectedService.map((service, index) => (
                                <div key={index} className="flex justify-between">
                                    <p>{service.name}:</p>
                                    <p>{service.amount} X {service.prize} = ETB {service.amount * service.prize}</p>
                                </div>
                            ))}
                        <div className="flex border border-white border-x-0 border-t-0 pb-3 justify-between">
                            <p>Ticket:</p>
                            <p>{totalTicket} X 100 = ETB {totalTicket * 100}</p>
                        </div>
                        <div className="flex justify-end">

                            <p>{totalMoney}ETB</p>
                        </div>
                    </div>


                    <div className="text-black mt-5 mx-10 flex justify-center gap-8 font-semibold w-[80%] bg-gradient-to-r from-green-500 to-yellow-400  py-1 text-[23px] whitespace-nowrap rounded-full shadow-[0_0_5px_5px_rgba(234,179,8,0.6)]">
                        <div onClick={() => handleNavigate()} className="text-center flex gap-3">
                            Buy Ticket <span className="font-bold">ETB {totalMoney}</span>
                        </div>
                    </div>



                </div>
            </div >
        </div >
    );
}
