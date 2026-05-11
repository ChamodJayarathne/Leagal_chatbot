import { useRef, useState, useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const sinhalaLayout = {
  default: [
    "් ැ ෑ ෘ ර්‍ ඵ ඥ ඝ ඞ ඪ ධ ඛ ඡ {bksp}",
    "{tab} ං ව ෙ ර ට ය ු ි ො ප [ ] \\",
    "{lock} ා ස ද ෆ ග හ ජ ක ල ; ' {enter}",
    "{shift} ෂ ඤ ච ඩ භ න ම , . / {shift}",
    ".com @ {space}"
  ],
  shift: [
    "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
    "{tab} ඣ ඍ ඓ ඊ ඌ ඌ ඖ ඵ { } |",
    "{lock} ආ ඈ ඊ ඌ ඍ ඎ ඏ ඐ : \" {enter}",
    "{shift} ඪ ඝ ඨ ඵ ධ ඛ ඡ < > ? {shift}",
    ".com @ {space}"
  ]
};

const tamilLayout = {
  default: [
    "1 2 3 4 5 6 7 8 9 0 - = {bksp}",
    "{tab} ஆ ஈ ஊ ஏ ஐ ஓ ஔ ழ ள ற் \\",
    "{lock} அ இ உ எ ஒ ப ம த ந ல ' {enter}",
    "{shift} ச ஞ ட ண ர ன க ங , . / {shift}",
    ".com @ {space}"
  ],
  shift: [
    "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
    "{tab} ஸ் ஷ ஜ ஹ க்ஷ் ஸ்ரீ ௐ ௹ ௺ ௸ |",
    "{lock} ஸ ஶ ௧ ௨ ௩ ௪ ௫ ௬ ௭ ௮ : \" {enter}",
    "{shift} ௯ ௰ ௱ ௲ ௳ ௴ ௵ ௶ < > ? {shift}",
    ".com @ {space}"
  ]
};

const englishLayout = {
  default: [
    "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
    "{tab} q w e r t y u i o p [ ] \\",
    "{lock} a s d f g h j k l ; ' {enter}",
    "{shift} z x c v b n m , . / {shift}",
    ".com @ {space}"
  ],
  shift: [
    "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
    "{tab} Q W E R T Y U I O P { } |",
    "{lock} A S D F G H J K L : \" {enter}",
    "{shift} Z X C V B N M < > ? {shift}",
    ".com @ {space}"
  ]
};

const displayOptions = {
  "{bksp}": "⌫",
  "{enter}": "↵",
  "{shift}": "⇧",
  "{tab}": "⇥",
  "{lock}": "⇪",
  "{space}": " ",
};

export default function VirtualKeyboard({ value, onChange, language }) {
  const [layoutName, setLayoutName] = useState("default");
  const keyboardRef = useRef(null);

  useEffect(() => {
    // Reset layout when language changes
    setLayoutName("default");
  }, [language]);

  useEffect(() => {
    // Update internal keyboard state if value changed from outside
    if (keyboardRef.current && keyboardRef.current.getInput() !== value) {
      keyboardRef.current.setInput(value);
    }
  }, [value]);

  const handleShift = () => {
    setLayoutName(layoutName === "default" ? "shift" : "default");
  };

  const handleKeyPress = (button) => {
    if (button === "{shift}" || button === "{lock}") {
      handleShift();
    }
  };

  const getLayout = () => {
    if (language === 'sinhala') return sinhalaLayout;
    if (language === 'tamil') return tamilLayout;
    return englishLayout;
  };

  return (
    <div className="w-full bg-navy-900/80 p-2 rounded-xl border border-white/10 shadow-2xl mt-2 backdrop-blur-xl">
      <style>{`
        .custom-keyboard {
          background-color: transparent !important;
        }
        .custom-keyboard .hg-button {
          background: rgba(255, 255, 255, 0.05) !important;
          color: white !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-bottom: 2px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px !important;
          transition: all 0.2s;
        }
        .custom-keyboard .hg-button:active, 
        .custom-keyboard .hg-button:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: translateY(1px);
          border-bottom-width: 1px !important;
        }
        .custom-keyboard .hg-button.hg-activeButton {
          background: rgba(255, 255, 255, 0.2) !important;
        }
        .custom-keyboard .hg-button-space {
          max-width: 50% !important;
        }
      `}</style>
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        layoutName={layoutName}
        layout={getLayout()}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        display={displayOptions}
        theme={"hg-theme-default hg-layout-default custom-keyboard"}
        physicalKeyboardHighlight={true}
        preventMouseDownDefault={true}
        buttonTheme={[
          {
            class: "text-lg",
            buttons: "{bksp} {enter} {shift} {tab} {lock} {space}"
          }
        ]}
      />
    </div>
  );
}
