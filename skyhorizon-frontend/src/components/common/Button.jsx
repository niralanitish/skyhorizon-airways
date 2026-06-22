function Button({

    children,

    onClick,

    className = "",

    type = "button"

}) {

    return (

        <button

            type={type}

            onClick={onClick}

            className={`
            
            bg-blue-700

            hover:bg-blue-800

            text-white

            rounded-xl

            px-6

            py-3

            font-semibold

            transition

            duration-300

            ${className}

            `}
        >

            {children}

        </button>

    );

}

export default Button;