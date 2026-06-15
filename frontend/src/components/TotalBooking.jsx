import React from 'react';

const TotalBooking = ({ total }) => {
    //const extraFee = 20; // Example extra fee
    const grandTotal = total;
    //const grandTotal = total + extraFee;

    return (
        <div className='w-full bg-transparent font-primary'>
            <h2 className='text-lg mb-4'>Booking Summary</h2>
            <div className='flex flex-col gap-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p>₹{total.toFixed(2)}</p>
                </div>
                <hr />
                {/* <div className='flex justify-between'>
                    <p>Platform Fee</p>
                    <p>₹{extraFee.toFixed(2)}</p>
                </div>
                <hr /> */}
                <div className='flex justify-between text-xl font-semibold '>
                    <p>Total</p>
                    <p>₹{grandTotal.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}

export default TotalBooking;
