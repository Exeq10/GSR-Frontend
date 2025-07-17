
import { Headset } from 'lucide-react';



function Footer() {
  return (
    <div className="bg-white border-t border-gray-200  mt-5 px-6 flex justify-between items-center  fixed-bottom w-full bottom-0 left-0">

      <div className="     flex  flex-col mt-4 md:mt-0  md:flex-row   items-center w-full  justify-between gap-4">
          
          <a href="mailto:contaxto@codexloop.tech" className=" flex items-center  gap-2"> <Headset className='w-4'/> Contacto con soporte </a>
          <p className="text-gray-400">GSR - Gestión de Salón de Reservas</p>
         <a href="https://www.codexloop.tech">  < img src="/1.png"   alt="logocodex"  className="w-auto h-24"  /> </a>
      </div>


    </div>
  )
}

export default Footer