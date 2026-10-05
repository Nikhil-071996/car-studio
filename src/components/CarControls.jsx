import { CARS } from "../config/carsConfig"

function CarControls({
    setCarIndex,
    currentCar
}) {

    const nextCar = () => {

        setCarIndex((prev) =>

            (prev + 1) % CARS.length
        )
    }

    const prevCar = () => {

        setCarIndex((prev) =>

            prev === 0
                ? CARS.length - 1
                : prev - 1
        )
    }

    return (

        <div
            className='car-controls-container'
        >

            <button
                onClick={prevCar}
            >
                ←
            </button>

            {
                currentCar
                ?
                <h1 className="car-name">
                {currentCar.name}
                </h1>
                :
                null
            }

            <button
                onClick={nextCar}
            >
                →
            </button>

        </div>
    )
}

export default CarControls