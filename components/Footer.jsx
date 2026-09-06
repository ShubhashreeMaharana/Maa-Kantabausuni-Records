import React from 'react';
import { getPLineWithYear, getCLineWithYear } from '../src/config/site';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t py-6 text-center text-sm text-gray-600">
      <div>{getCLineWithYear()}</div>
      <div>{getPLineWithYear()}</div>
      <div className="mt-2">Maa Kantabausuni Records Pvt Ltd — All rights reserved</div>
    </footer>
  );
}
