import React from 'react'
import {UpcomingRaffles ,ResultsTable}from '../components'
import MoMo from '../assets/Momo.png'


const Dashboard = () => {
  return (
    <div >
      <div className='w-full flex flex-row justify-between  h-14'>
        <h2 className="text-2xl font-bold text-black ml-8 mt-3">Dashboard</h2>
        <img src={MoMo} alt="Logo 1" className="h-14" />
      </div>
     <UpcomingRaffles />
     <ResultsTable/>
    </div>
  )
}

export default Dashboard
