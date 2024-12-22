import React from 'react'
import './loader.css'
export default function Loading() {
    return (
        <div className='w-full h-screen  bg-gray-900 flex justify-center items-center'>
            <div class="loader">
                <div class="inner one"></div>
                <div class="inner two"></div>
                <div class="inner three"></div>
            </div>
        </div>

    )
}
