import { Link, NavLink } from "react-router-dom";
import { FaPlaneDeparture } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useState } from "react";

import Container from "../common/Container";
import Button from "../common/Button";

function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);

    return (

        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">

            <Container className="h-20 flex items-center justify-between">

                {/* Logo */}

                <Link
                    to="/"
                    className="flex items-center gap-3"
                >

                    <div className="bg-blue-700 p-2 rounded-xl">

                        <FaPlaneDeparture className="text-white text-xl"/>

                    </div>

                    <div>

                        <h1 className="text-xl font-bold text-slate-900">

                            SkyHorizon

                        </h1>

                        <p className="text-xs text-slate-500">

                            Airways

                        </p>

                    </div>

                </Link>

                {/* Desktop Menu */}

                <nav className="hidden lg:flex items-center gap-8">

                    <NavLink to="/">Flights</NavLink>

                    <NavLink to="/">Hotels</NavLink>

                    <NavLink to="/">Offers</NavLink>

                    <NavLink to="/">My Trips</NavLink>

                    <NavLink to="/">Support</NavLink>

                </nav>

                {/* Right */}

                <div className="hidden lg:flex items-center gap-4">

                    <Link to="/login">

                        Login

                    </Link>

                    <Link to="/register">

                        <Button>

                            Sign Up

                        </Button>

                    </Link>

                </div>

                {/* Mobile */}

                <button

                    onClick={() => setMenuOpen(!menuOpen)}

                    className="lg:hidden text-3xl"

                >

                    <HiOutlineMenuAlt3/>

                </button>

            </Container>

            {

                menuOpen && (

                    <div className="lg:hidden border-t bg-white">

                        <Container className="py-6 flex flex-col gap-5">

                            <Link to="/">Flights</Link>

                            <Link to="/">Hotels</Link>

                            <Link to="/">Offers</Link>

                            <Link to="/">My Trips</Link>

                            <Link to="/">Support</Link>

                            <Link to="/login">

                                Login

                            </Link>

                            <Button>

                                Sign Up

                            </Button>

                        </Container>

                    </div>

                )

            }

        </header>

    );

}

export default Navbar;