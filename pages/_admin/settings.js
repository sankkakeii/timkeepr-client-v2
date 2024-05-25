import Head from "next/head";
import Link from 'next/link';
import Image from "next/image";
import { useState } from "react";
import MapArea from "../../components/MapArea";
import styles from "../../styles/Home.module.css";

export default function Admin() {

  const [coordinates, setCoordinates] = useState({
    lat: 2.996576908645812,
    lng: 101.59493478782426,
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-200">
      <Head>
        <title>Admin - Timekeepr App</title>
        <meta name="description" content="Admin panel for Timekeepr App." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <aside className="w-full md:w-64 bg-white shadow-md md:h-screen">
        <div className="p-4">
          <h1 className="text-2xl font-extrabold mb-5 text-gray-500">Timekeepr</h1>
        </div>
        <nav className="mt-8">
          <ul>
            <li>
              <Link href="/_admin/add-user">
                <a className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Add User</a>
              </Link>
            </li>
            <li>
              <Link href="/_admin/view-users">
                <a className="block px-4 py-2 text-gray-600 hover:bg-gray-100">View Users</a>
              </Link>
            </li>
            <li>
              <Link href="/_admin/settings">
                <a className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Settings</a>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <div className="py-3">
          <div className="relative px-4 py-5 bg-white shadow-lg sm:rounded-3xl w-fit">
            <MapArea></MapArea>
          </div>
        </div>
      </main>
    </div>
  );
}
