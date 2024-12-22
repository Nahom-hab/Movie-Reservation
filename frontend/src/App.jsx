import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminHome from './page/Admin/AdminHome';
import ViewTicket from './page/Admin/ViewTicket';
import Movie from './page/client/Movie';
import Home from './page/client/Home';
import Youtube from './page/client/youtube';
import Ticket from './page/client/Ticket';
import BuyTicket from './page/client/BuyTicket';
import TicketSuccsus from './page/client/TicketSuccsus';
import TicketAdmin from './page/Admin/TicketAdmin';
import QRCodeScanner from './page/Admin/QrScanner';
import Settings from './page/Admin/Settings';


export default function App() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path='/admin' element={<AdminHome />}></Route>

        <Route path='/' element={<Home />}></Route>
        <Route path='/movie' element={<Movie />}></Route>
        <Route path='/youtube' element={<Youtube />}></Route>
        <Route path='/ticket' element={<Ticket />}></Route>
        <Route path='/buyTicket' element={<BuyTicket />}></Route>
        <Route path='/ticketSuccsuss' element={<TicketSuccsus />}></Route>


        <Route path='/admin' element={<AdminHome />}></Route>
        <Route path='/admin/tickets' element={<ViewTicket />}></Route>
        <Route path='/admin/qrcode' element={<TicketAdmin />}></Route>
        <Route path='/admin/scanner' element={<QRCodeScanner />}></Route>
        <Route path='/admin/settings' element={<Settings />}></Route>












      </Routes>
    </BrowserRouter>
  );
}

