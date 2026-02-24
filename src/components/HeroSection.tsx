import React, { useState, useEffect } from 'react';
import { analyzeSessionLive, ClinicalInsight } from '../Logic/AaliyahEngine';

const HeroSection: React.FC = () => {
    const [isListening, setIsListening] = useState(false);
    const [insights, setInsights] = useState<ClinicalInsight[]>([]);

    const whisperToTherapist = (message: string) => {
        const speech = new SpeechSynthesisUtterance(message);
        speech.volume = 0.7;
        speech.rate = 0.9;
        window.speechSynthesis.speak(speech);
    };

    const handleNewTranscript = (text: string) => {
        const result = analyzeSessionLive(text);
        if (result) {
            whisperToTherapist(`${result.message}. ${result.action}`);
            setInsights(prev => [result, ...prev]);
        }
    };

    const saveSession = () => {
        const sessionData = { date: new Date().toLocaleDateString(), insights };
        const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `SomaSync_SOAP_Record.json`;
        link.click();
    };

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.onresult = (event: any) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            handleNewTranscript(transcript);
        };
        if (isListening) recognition.start();
        return () => recognition.stop();
    }, [isListening]);

    return (
        <section className="hero-section">
            <header className="dashboard-header">
                <div className="logo-container">
                    <img src="/images/ss.png" alt="SomaSync" style={{height: '50px'}} />
                    <div className="divider" style={{width:'1px', height:'40px', background:'#555', margin:'0 20px'}}></div>
                    <img src="/images/Aaliyah-logo.png" alt="Aaliyah" style={{height: '50px', borderRadius:'50%'}} />
                    <h2 style={{marginLeft:'10px'}}>ΛΛLIYΛH.IO</h2>
                </div>
            </header>

            <div className="container" style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', padding: '20px'}}>
                {/* COL 1 */}
                <div className="column">
                    <h3>In-Ear Feed</h3>
                    <button className="mic-btn" onClick={() => setIsListening(!isListening)}>
                        {isListening ? 'STOP SESSION' : 'START SESSION'}
                    </button>
                </div>
                {/* COL 2 */}
                <div className="column">
                    <h3>ΛΛLIYΛH.IO Insights</h3>
                    {insights.map((item, i) => (
                        <div key={i} className={`insight-card ${item.type.toLowerCase()}`} style={{borderLeft: '4px solid red', margin:'10px 0', padding:'10px', background:'rgba(255,255,255,0.05)'}}>
                            <strong>{item.type}</strong>: {item.message}
                        </div>
                    ))}
                </div>
                {/* COL 3 */}
                <div className="column">
                    <h3>Clinical Archive</h3>
                    <p>ICD-10 Mapping: M79.12</p>
                    <button onClick={saveSession} style={{width:'100%', padding:'10px', background:'#00f2fe', color:'#000', fontWeight:'bold'}}>
                        FINALIZE SOAP NOTE
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;