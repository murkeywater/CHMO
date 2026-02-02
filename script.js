// Ждем загрузки всей страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('ResumeBuilder загружен!');
    
    // === ВСЕ ПЕРЕМЕННЫЕ ===
    const nameInput = document.getElementById('name');
    const titleInput = document.getElementById('title');
    const emailInput = document.getElementById('email');
    const githubInput = document.getElementById('github');
    const skillsInput = document.getElementById('skills');
    const experienceInput = document.getElementById('experience');
    const projectsInput = document.getElementById('projects');
    const avatarInput = document.getElementById('avatar');
    const avatarFileInput = document.getElementById('avatarFile');
    const uploadAvatarBtn = document.getElementById('uploadAvatar');
    const customUrlInput = document.getElementById('customUrl');
    const generateUrlBtn = document.getElementById('generateUrl');
    const autoSaveToggle = document.getElementById('autoSave');
    const saveNowBtn = document.getElementById('saveNow');
    const clearStorageBtn = document.getElementById('clearStorage');
    const deviceBtns = document.querySelectorAll('.device-btn');
    
    // Элементы предпросмотра
    const previewName = document.getElementById('previewName');
    const previewTitle = document.getElementById('previewTitle');
    const previewEmail = document.getElementById('previewEmail');
    const previewGithub = document.getElementById('previewGithub');
    const previewSkills = document.getElementById('previewSkills');
    const previewExperience = document.getElementById('previewExperience');
    const resumePreview = document.getElementById('resumePreview');
    const avatarPreview = document.getElementById('avatarPreview');
    const resumeAvatar = document.getElementById('resumeAvatar');
    const avatarContainer = document.getElementById('avatarContainer');
    
    // Кнопки
    const previewBtn = document.getElementById('previewBtn');
    const exportBtn = document.getElementById('exportBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    // Шаблоны
    const templates = document.querySelectorAll('.template');
    
    // Дополнительные секции
    const extraSectionsContainer = document.getElementById('extraSections');
    const sectionButtons = document.querySelectorAll('.section-btn');
    
    // Текущий активный шаблон
    let currentTemplate = 1;
    let currentDevice = 'desktop';
    
    // Объект для хранения данных
    const resumeData = {
        projects: [],
        education: [],
        languages: [],
        certificates: [],
        avatar: '',
        customUrl: '',
        lastSaved: null
    };
    
    // === ОСНОВНЫЕ ФУНКЦИИ ===
    
    // Функция обновления предпросмотра
    function updatePreview() {
        // Основные поля
        previewName.textContent = nameInput.value || 'Иванов Алексей Петрович';
        previewTitle.textContent = titleInput.value || 'Frontend-разработчик (React)';
        previewEmail.textContent = emailInput.value || 'alexey@example.com';
        previewGithub.textContent = githubInput.value 
            ? githubInput.value.replace('https://', '').replace('github.com/', '') 
            : 'github.com/username';
        
        // Аватар
        if (resumeData.avatar) {
            resumeAvatar.src = resumeData.avatar;
            avatarContainer.style.display = 'block';
            avatarPreview.innerHTML = `<img src="${resumeData.avatar}" alt="Аватар">`;
        } else {
            avatarContainer.style.display = 'none';
            avatarPreview.innerHTML = '<i class="fas fa-user"></i>';
        }
        
        // Навыки
        if (skillsInput.value.trim()) {
            const skillsArray = skillsInput.value.split(',').map(skill => skill.trim());
            previewSkills.innerHTML = '';
            skillsArray.forEach(skill => {
                if (skill) {
                    const skillTag = document.createElement('span');
                    skillTag.className = 'skill-tag';
                    skillTag.textContent = skill;
                    previewSkills.appendChild(skillTag);
                }
            });
        }
        
        // Опыт работы
        if (experienceInput.value.trim()) {
            const experienceLines = experienceInput.value.split('\n');
            previewExperience.innerHTML = '';
            experienceLines.forEach(line => {
                if (line.trim()) {
                    const p = document.createElement('p');
                    p.textContent = line;
                    previewExperience.appendChild(p);
                }
            });
        }
        
        // Проекты
        if (resumeData.projects.length > 0) {
            updateSectionInPreview('projects', 'Проекты', 'project-diagram');
        }
        
        // Дополнительные секции
        ['education', 'languages', 'certificates'].forEach(sectionType => {
            if (resumeData[sectionType].length > 0) {
                updateSectionInPreview(sectionType, 
                    sectionType === 'education' ? 'Образование' :
                    sectionType === 'languages' ? 'Языки' : 'Сертификаты',
                    getIcon(sectionType)
                );
            }
        });
        
        // Шаблон
        const resume = document.getElementById('resumeTemplate');
        resume.className = 'resume';
        resume.classList.add(`template${currentTemplate}`);
        
        // Цвет skill-tag
        const skillTags = resume.querySelectorAll('.skill-tag');
        skillTags.forEach(tag => {
            tag.style.background = '';
            
            if (currentTemplate === 2) {
                tag.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
            } else if (currentTemplate === 3) {
                tag.style.background = '#2d3748';
                tag.style.color = 'white';
                tag.style.borderRadius = '5px';
            } else {
                tag.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }
        });
        
        // Устройство
        updateDevicePreview();
        
        // Автосохранение
        if (autoSaveToggle.checked) {
            saveToLocalStorage();
        }
    }
    
    // Обновление секции в предпросмотре
    function updateSectionInPreview(sectionType, title, icon) {
        const resume = document.getElementById('resumeTemplate');
        let section = document.getElementById(`preview${capitalize(sectionType)}Container`);
        
        if (!section) {
            section = document.createElement('section');
            section.className = 'resume-section';
            section.id = `preview${capitalize(sectionType)}Container`;
            section.innerHTML = `
                <h2><i class="fas fa-${icon}"></i> ${title}</h2>
                <div id="preview${capitalize(sectionType)}"></div>
            `;
            resume.appendChild(section);
        }
        
        const contentDiv = document.getElementById(`preview${capitalize(sectionType)}`);
        if (contentDiv) {
            contentDiv.innerHTML = '';
            resumeData[sectionType].forEach(item => {
                if (item.trim()) {
                    const p = document.createElement('p');
                    p.textContent = item;
                    contentDiv.appendChild(p);
                }
            });
        }
    }
    
    // Обновление предпросмотра устройства
    // Обновление предпросмотра устройства
function updateDevicePreview() {
    console.log('Обновление предпросмотра устройства:', currentDevice);
    
    // Убираем все элементы девайсов
    const phoneNotch = document.getElementById('phone-notch');
    const phoneButton = document.getElementById('phone-button');
    const tabletButton = document.getElementById('tablet-button');
    
    if (phoneNotch) phoneNotch.remove();
    if (phoneButton) phoneButton.remove();
    if (tabletButton) tabletButton.remove();
    
    // Сбрасываем стили к базовым
    resumePreview.style.cssText = `
        border: 2px dashed #cbd5e0;
        border-radius: 15px;
        padding: 20px;
        background: #fafafa;
        min-height: 500px;
        overflow-y: auto;
        transition: all 0.5s ease;
        margin: 0;
        width: 100%;
        max-width: none;
        height: auto;
        position: relative;
    `;
    
    // Применяем стили для каждого устройства
    if (currentDevice === 'mobile') {
        console.log('📱 Мобильный предпросмотр');
        
        // Адаптируем размер под экран
        const isMobileScreen = window.innerWidth <= 480;
        const previewWidth = isMobileScreen ? '280px' : '375px';
        const previewHeight = isMobileScreen ? '550px' : '700px';
        
        resumePreview.style.cssText = `
            width: ${previewWidth};
            max-width: ${previewWidth};
            height: ${previewHeight};
            margin: 10px auto;
            border: 15px solid #1a202c;
            border-top-width: 50px;
            border-bottom-width: 50px;
            border-radius: 40px;
            padding: 15px 10px;
            background: white;
            box-shadow: 0 15px 50px rgba(0,0,0,0.2);
            position: relative;
            overflow-y: auto;
            transition: all 0.5s ease;
        `;
        
        // Добавляем чёлку телефона
        const notch = document.createElement('div');
        notch.id = 'phone-notch';
        notch.style.cssText = `
            position: absolute;
            top: -35px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 25px;
            background: #1a202c;
            border-radius: 20px;
            z-index: 1;
        `;
        resumePreview.appendChild(notch);
        
        // Добавляем кнопку телефона
        const button = document.createElement('div');
        button.id = 'phone-button';
        button.style.cssText = `
            position: absolute;
            bottom: -35px;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
            height: 50px;
            background: #1a202c;
            border-radius: 50%;
            z-index: 1;
        `;
        resumePreview.appendChild(button);
        
    } else if (currentDevice === 'tablet') {
        console.log('📟 Планшетный предпросмотр');
        
        // Адаптируем размер под экран
        const isMobileScreen = window.innerWidth <= 768;
        const previewWidth = isMobileScreen ? '450px' : '768px';
        const previewHeight = isMobileScreen ? '700px' : '900px';
        
        resumePreview.style.cssText = `
            width: ${previewWidth};
            max-width: ${previewWidth};
            height: ${previewHeight};
            margin: 10px auto;
            border: 15px solid #1a202c;
            border-top-width: 40px;
            border-bottom-width: 40px;
            border-radius: 25px;
            padding: 30px 20px;
            background: white;
            box-shadow: 0 15px 50px rgba(0,0,0,0.2);
            position: relative;
            overflow-y: auto;
            transition: all 0.5s ease;
        `;
        
        // Добавляем кнопку планшета
        const button = document.createElement('div');
        button.id = 'tablet-button';
        button.style.cssText = `
            position: absolute;
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 5px;
            background: #2d3748;
            border-radius: 10px;
            z-index: 1;
        `;
        resumePreview.appendChild(button);
        
    } else {
        console.log('🖥️ Десктопный предпросмотр');
        // Оставляем базовые стили
    }
}
    
    // === LOCALSTORAGE ФУНКЦИИ ===
    
    // Сохранение в LocalStorage
    function saveToLocalStorage() {
        const data = {
            name: nameInput.value,
            title: titleInput.value,
            email: emailInput.value,
            github: githubInput.value,
            skills: skillsInput.value,
            experience: experienceInput.value,
            projects: projectsInput.value,
            customUrl: customUrlInput.value,
            template: currentTemplate,
            avatar: resumeData.avatar,
            extraSections: {
                education: resumeData.education,
                languages: resumeData.languages,
                certificates: resumeData.certificates
            }
        };
        
        localStorage.setItem('resumeBuilderData', JSON.stringify(data));
        resumeData.lastSaved = new Date().toISOString();
        
        showSaveNotification('Автосохранение выполнено');
    }
    
    // Загрузка из LocalStorage
    function loadFromLocalStorage() {
        const saved = localStorage.getItem('resumeBuilderData');
        if (!saved) return;
        
        try {
            const data = JSON.parse(saved);
            
            nameInput.value = data.name || '';
            titleInput.value = data.title || '';
            emailInput.value = data.email || '';
            githubInput.value = data.github || '';
            skillsInput.value = data.skills || '';
            experienceInput.value = data.experience || '';
            projectsInput.value = data.projects || '';
            customUrlInput.value = data.customUrl || '';
            currentTemplate = data.template || 1;
            resumeData.avatar = data.avatar || '';
            
            if (data.extraSections) {
                resumeData.education = data.extraSections.education || [];
                resumeData.languages = data.extraSections.languages || [];
                resumeData.certificates = data.extraSections.certificates || [];
                
                // Восстанавливаем UI дополнительных секций
                ['education', 'languages', 'certificates'].forEach(sectionType => {
                    if (resumeData[sectionType].length > 0) {
                        addSection(sectionType);
                        const input = document.getElementById(`${sectionType}Input`);
                        if (input) {
                            input.value = resumeData[sectionType].join('\n');
                        }
                    }
                });
            }
            
            // Обновляем выбранный шаблон
            templates.forEach(t => {
                t.classList.remove('active');
                if (t.dataset.template == currentTemplate) {
                    t.classList.add('active');
                }
            });
            
            updatePreview();
            showNotification('Данные загружены из автосохранения', 'success');
            
        } catch (e) {
            console.error('Ошибка загрузки из LocalStorage:', e);
            clearLocalStorage();
        }
    }
    
    // Очистка LocalStorage
    function clearLocalStorage() {
        localStorage.removeItem('resumeBuilderData');
        nameInput.value = '';
        titleInput.value = '';
        emailInput.value = '';
        githubInput.value = '';
        skillsInput.value = '';
        experienceInput.value = '';
        projectsInput.value = '';
        customUrlInput.value = '';
        resumeData.avatar = '';
        resumeData.education = [];
        resumeData.languages = [];
        resumeData.certificates = [];
        
        // Удаляем дополнительные секции
        document.querySelectorAll('.dynamic-section').forEach(el => el.remove());
        extraSectionsContainer.style.display = 'none';
        sectionButtons.forEach(btn => btn.classList.remove('active'));
        
        updatePreview();
        showNotification('Все данные очищены', 'info');
    }
    
    // === ГЕНЕРАЦИЯ УНИКАЛЬНОЙ ССЫЛКИ ===
    
    function generateCustomUrl() {
        const name = nameInput.value.trim();
        const randomId = Math.random().toString(36).substr(2, 6);
        
        if (name) {
            // Транслитерация имени
            const translit = name.toLowerCase()
                .replace(/[а-яё]/g, char => {
                    const map = {
                        'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh',
                        'з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o',
                        'п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts',
                        'ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu',
                        'я':'ya'
                    };
                    return map[char] || char;
                })
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            
            customUrlInput.value = translit || randomId;
        } else {
            customUrlInput.value = randomId;
        }
        
        updateUrlPreview();
    }
    
    function updateUrlPreview() {
        const url = customUrlInput.value.trim();
        const fullUrl = `resume-builder.com/${url || 'ваше-имя'}`;
        document.querySelector('.full-url').textContent = fullUrl;
    }
    
    // === РАБОТА С АВАТАРОМ ===
    
    function handleAvatarUpload() {
        avatarFileInput.click();
    }
    
    function handleAvatarFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            showNotification('Выберите изображение', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Размер файла не должен превышать 5MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            resumeData.avatar = e.target.result;
            updatePreview();
            showNotification('Аватар загружен', 'success');
        };
        reader.readAsDataURL(file);
    }
    
    // === УТИЛИТЫ ===
    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    function getIcon(sectionType) {
        const icons = {
            education: 'graduation-cap',
            languages: 'language',
            certificates: 'certificate',
            projects: 'project-diagram'
        };
        return icons[sectionType] || 'plus';
    }
    
    function showNotification(message, type = 'info') {
        // Удаляем старые уведомления
        document.querySelectorAll('.notification').forEach(el => el.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                                type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="close-notification"><i class="fas fa-times"></i></button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : 
                         type === 'error' ? '#f56565' : '#667eea'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        notification.querySelector('.close-notification').onclick = function() {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        };
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    function showSaveNotification(message) {
        const existing = document.querySelector('.save-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'save-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    // === ФУНКЦИИ ДЛЯ ДОПОЛНИТЕЛЬНЫХ СЕКЦИЙ ===
    
    function addSection(sectionType) {
        const existingSection = document.getElementById(`${sectionType}Section`);
        if (existingSection) {
            existingSection.style.display = 'block';
            return;
        }
        
        const section = document.createElement('div');
        section.className = 'dynamic-section';
        section.id = `${sectionType}Section`;
        
        const titles = {
            education: 'Образование',
            languages: 'Языки',
            certificates: 'Сертификаты'
        };
        
        const placeholders = {
            education: '• МГУ, Факультет ВМК, 2015-2019\n• Курсы Яндекс.Практикум, 2020',
            languages: '• Русский — родной\n• Английский — B2 (Upper-Intermediate)\n• Немецкий — A2',
            certificates: '• AWS Certified Developer\n• MongoDB University M001\n• Яндекс: Алгоритмы и структуры данных'
        };
        
        section.innerHTML = `
            <h4>
                <span><i class="fas fa-${getIcon(sectionType)}"></i> ${titles[sectionType]}</span>
                <button class="remove-section" data-section="${sectionType}">
                    <i class="fas fa-times"></i>
                </button>
            </h4>
            <textarea 
                id="${sectionType}Input" 
                rows="3" 
                placeholder="${placeholders[sectionType]}"
            ></textarea>
        `;
        
        extraSectionsContainer.appendChild(section);
        extraSectionsContainer.style.display = 'block';
        
        section.querySelector('.remove-section').addEventListener('click', function() {
            removeSection(this.dataset.section);
        });
        
        const textarea = section.querySelector('textarea');
        textarea.addEventListener('input', function() {
            updateSectionData(sectionType, this.value);
        });
        
        // Восстанавливаем данные если есть
        if (resumeData[sectionType].length > 0) {
            textarea.value = resumeData[sectionType].join('\n');
        }
        
        document.querySelector(`[data-section="${sectionType}"]`).classList.add('active');
    }
    
    function removeSection(sectionType) {
        const section = document.getElementById(`${sectionType}Section`);
        if (section) {
            section.remove();
            resumeData[sectionType] = [];
            updatePreview();
            document.querySelector(`[data-section="${sectionType}"]`).classList.remove('active');
        }
    }
    
    function updateSectionData(sectionType, value) {
        resumeData[sectionType] = value.split('\n').filter(line => line.trim());
        updatePreview();
    }
    
    // === PDF ЭКСПОРТ ===
    
    function prepareForExport(element) {
        const clone = element.cloneNode(true);
        const style = document.createElement('style');
        style.textContent = `
            .resume {
                width: 210mm !important;
                min-height: 297mm !important;
                padding: 20mm !important;
                margin: 0 !important;
                box-shadow: none !important;
                background: white !important;
                font-size: 12pt !important;
                line-height: 1.5 !important;
            }
            .resume-header { page-break-after: avoid !important; }
            .resume-section { page-break-inside: avoid !important; margin-bottom: 15px !important; }
            h1 { font-size: 24pt !important; margin-bottom: 10px !important; }
            h2 { font-size: 18pt !important; margin-bottom: 10px !important; }
            p, li { font-size: 11pt !important; }
            .skill-tag { display: inline-block !important; margin: 2px !important; padding: 4px 8px !important; font-size: 10pt !important; }
            * { animation: none !important; transition: none !important; }
        `;
        clone.appendChild(style);
        return clone;
    }
    
    async function exportToPDF() {
        try {
            showProgress(true);
            updateProgress(10, 'Подготовка данных...');
            
            const resumeElement = document.getElementById('resumeTemplate');
            const exportBtn = document.getElementById('exportBtn');
            const originalText = exportBtn.innerHTML;
            exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Экспорт...';
            exportBtn.disabled = true;
            
            updateProgress(30, 'Оптимизация стилей...');
            const clone = prepareForExport(resumeElement);
            
            clone.style.position = 'absolute';
            clone.style.left = '-9999px';
            document.body.appendChild(clone);
            
            updateProgress(50, 'Создание изображения...');
            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            
            document.body.removeChild(clone);
            
            updateProgress(80, 'Создание PDF...');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const imgData = canvas.toDataURL('image/png', 1.0);
            
            updateProgress(90, 'Сохранение файла...');
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            
            const fileName = `resume_${nameInput.value || 'anonymous'}_${new Date().toISOString().split('T')[0]}.pdf`
                .replace(/[^a-z0-9а-яё_-]/gi, '_')
                .toLowerCase();
            
            updateProgress(100, 'Завершение...');
            
            setTimeout(() => {
                pdf.save(fileName);
                showProgress(false);
                
                exportBtn.innerHTML = originalText;
                exportBtn.disabled = false;
                
                showNotification('✅ Резюме успешно экспортировано!', 'success');
            }, 500);
            
        } catch (error) {
            console.error('PDF Export Error:', error);
            showProgress(false);
            
            const exportBtn = document.getElementById('exportBtn');
            if (exportBtn) {
                exportBtn.innerHTML = '<i class="fas fa-download"></i> Экспорт в PDF';
                exportBtn.disabled = false;
            }
            
            showNotification('❌ Ошибка экспорта', 'error');
        }
    }
    
    function showProgress(show = true) {
        const progress = document.getElementById('exportProgress');
        if (progress) {
            progress.style.display = show ? 'block' : 'none';
        }
    }
    
    function updateProgress(percent, text) {
        const fill = document.getElementById('progressFill');
        const textEl = document.getElementById('progressText');
        
        if (fill) fill.style.width = percent + '%';
        if (textEl) textEl.textContent = text;
    }
    
    // === ИНИЦИАЛИЗАЦИЯ СОБЫТИЙ ===
    
    previewBtn.addEventListener('click', updatePreview);
    exportBtn.addEventListener('click', exportToPDF);
    saveBtn.addEventListener('click', saveOnline);
    
    // Автообновление полей
    nameInput.addEventListener('input', () => {
        previewName.textContent = nameInput.value || 'Имя';
        if (autoSaveToggle.checked) saveToLocalStorage();
    });
    
    titleInput.addEventListener('input', () => {
        previewTitle.textContent = titleInput.value || 'Должность';
        if (autoSaveToggle.checked) saveToLocalStorage();
    });
    
    emailInput.addEventListener('input', () => {
        previewEmail.textContent = emailInput.value || 'Email';
        if (autoSaveToggle.checked) saveToLocalStorage();
    });
    
    githubInput.addEventListener('input', () => {
        previewGithub.textContent = githubInput.value 
            ? githubInput.value.replace('https://', '').replace('github.com/', '')
            : 'GitHub';
        if (autoSaveToggle.checked) saveToLocalStorage();
    });
    
    skillsInput.addEventListener('input', () => {
        if (autoSaveToggle.checked) saveToLocalStorage();
    });
    
    experienceInput.addEventListener('input', () => {
        if (autoSaveToggle.checked) saveToLocalStorage();
    });
    
    projectsInput.addEventListener('input', function() {
        updateSectionData('projects', this.value);
        if (autoSaveToggle.checked) saveToLocalStorage();
    });
    
    avatarInput.addEventListener('input', function() {
        if (this.value) {
            resumeData.avatar = this.value;
            updatePreview();
            if (autoSaveToggle.checked) saveToLocalStorage();
        }
    });
    
    // Шаблоны
    templates.forEach(template => {
        template.addEventListener('click', function() {
            currentTemplate = this.dataset.template;
            templates.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            updatePreview();
        });
    });
    
    // Дополнительные секции
    sectionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionType = this.dataset.section;
            addSection(sectionType);
        });
    });
    
    // Аватар
    uploadAvatarBtn.addEventListener('click', handleAvatarUpload);
    avatarFileInput.addEventListener('change', handleAvatarFileSelect);
    
    // Генерация ссылки
    generateUrlBtn.addEventListener('click', generateCustomUrl);
    customUrlInput.addEventListener('input', updateUrlPreview);
    
    // Сохранение
    saveNowBtn.addEventListener('click', saveToLocalStorage);
    clearStorageBtn.addEventListener('click', clearLocalStorage);
    
    // Устройства
    deviceBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Клик по кнопке устройства:', this.dataset.device);
            
            // Убираем активность со всех кнопок
            deviceBtns.forEach(b => b.classList.remove('active'));
            
            // Добавляем активность текущей
            this.classList.add('active');
            currentDevice = this.dataset.device;
            
            console.log('Текущее устройство установлено:', currentDevice);
            
            // Обновляем предпросмотр
            updateDevicePreview();
            updatePreview();
            
            showNotification(`Предпросмотр: ${this.textContent.trim()}`, 'info');
        });
    });
    
    // Отмена экспорта
    document.getElementById('cancelExport')?.addEventListener('click', function() {
        showProgress(false);
        showNotification('Экспорт отменен', 'info');
    });
    
    // Инициализация Clipboard.js
    new ClipboardJS('.copy-url');
    
    // Функция сохранения онлайн (заглушка)
    function saveOnline() {
        showNotification('Функция сохранения онлайн в разработке', 'info');
    }
    
    // === ЗАГРУЗКА И ИНИЦИАЛИЗАЦИЯ ===
    
    // Инициализация предпросмотра устройств
    function initDevicePreview() {
        console.log('Инициализация предпросмотра устройств...');
        
        // Устанавливаем десктоп как активный по умолчанию
        const desktopBtn = document.querySelector('[data-device="desktop"]');
        if (desktopBtn) {
            desktopBtn.classList.add('active');
            currentDevice = 'desktop';
            console.log('Десктоп установлен как активный');
        }
        
        // Применяем стили
        updateDevicePreview();
        console.log('Стили применены, текущее устройство:', currentDevice);
    }
    
    // Загружаем сохраненные данные
    setTimeout(() => {
        loadFromLocalStorage();
        initDevicePreview();
        
        // Демо-данные если ничего нет
        if (!localStorage.getItem('resumeBuilderData')) {
            nameInput.value = "Петров Дмитрий Сергеевич";
            titleInput.value = "Fullstack Developer (Node.js + React)";
            emailInput.value = "dmitry@example.com";
            githubInput.value = "https://github.com/dmitrypetrov";
            skillsInput.value = "JavaScript, TypeScript, React, Node.js, Express, MongoDB, Docker, AWS";
            experienceInput.value = "• Senior Fullstack Developer в VK (2020-2024)\n• Разработка микросервисной архитектуры\n• Оптимизация запросов к БД\n• Наставничество junior-разработчиков";
            projectsInput.value = "• Pet-проект: CRM система на React + Node.js\n• Опенсорс: контрибьютил в библиотеку UI-компонентов";
            generateCustomUrl();
        }
        
        updatePreview();
        updateUrlPreview();
        
        showNotification('ResumeBuilder готов к работе!', 'success');
        
    }, 100);
    // === БЭКЕНД ФУНКЦИИ ===

const API_URL = 'http://localhost:3000/api';

// Сохранение на сервер
async function saveToServer() {
    try {
        const resumeData = {
            name: nameInput.value,
            title: titleInput.value,
            email: emailInput.value,
            github: githubInput.value,
            skills: skillsInput.value,
            experience: experienceInput.value,
            projects: projectsInput.value,
            customUrl: customUrlInput.value,
            template: currentTemplate,
            avatar: resumeData.avatar,
            education: resumeData.education.join('\n'),
            languages: resumeData.languages.join('\n'),
            certificates: resumeData.certificates.join('\n')
        };
        
        showNotification('Отправка на сервер...', 'info');
        
        const response = await fetch(`${API_URL}/resumes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resumeData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('✅ Резюме сохранено на сервере!', 'success');
            console.log('Ссылка на резюме:', result.data.url);
            
            // Обновляем ссылку на странице
            const resumeLink = document.getElementById('resumeLink');
            if (resumeLink) {
                resumeLink.textContent = result.data.url;
                resumeLink.href = result.data.url;
            }
            
            return result.data;
        } else {
            throw new Error(result.error || 'Ошибка сервера');
        }
        
    } catch (error) {
        console.error('Save to server error:', error);
        showNotification('❌ Ошибка сохранения на сервере', 'error');
        return null;
    }
}

// Загрузка с сервера по ID
async function loadFromServer(id) {
    try {
        const response = await fetch(`${API_URL}/resumes/${id}`);
        const result = await response.json();
        
        if (result.success) {
            const data = result.data;
            
            nameInput.value = data.name || '';
            titleInput.value = data.title || '';
            emailInput.value = data.email || '';
            githubInput.value = data.github || '';
            skillsInput.value = data.skills || '';
            experienceInput.value = data.experience || '';
            projectsInput.value = data.projects || '';
            customUrlInput.value = data.customUrl || '';
            currentTemplate = data.template || 1;
            resumeData.avatar = data.avatar || '';
            
            if (data.education) {
                resumeData.education = data.education.split('\n').filter(l => l.trim());
            }
            if (data.languages) {
                resumeData.languages = data.languages.split('\n').filter(l => l.trim());
            }
            if (data.certificates) {
                resumeData.certificates = data.certificates.split('\n').filter(l => l.trim());
            }
            
            updatePreview();
            showNotification('Данные загружены с сервера', 'success');
            
        } else {
            throw new Error(result.error);
        }
        
    } catch (error) {
        console.error('Load from server error:', error);
        showNotification('Ошибка загрузки с сервера', 'error');
    }
}

// Получить статистику
async function getStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const result = await response.json();
        
        if (result.success) {
            console.log('📊 Статистика:', result.data);
            return result.data;
        }
    } catch (error) {
        console.error('Stats error:', error);
    }
    return null;
}

// Обновляем функцию saveOnline
function saveOnline() {
    saveToServer().then(data => {
        if (data) {
            // Показываем модальное окно со ссылкой
            showShareModal(data.url, data.editUrl);
        }
    });
}

// Модальное окно для шаринга
function showShareModal(viewUrl, editUrl) {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3><i class="fas fa-share-alt"></i> Ваше резюме сохранено!</h3>
            
            <div class="share-link">
                <label>Ссылка для просмотра:</label>
                <div class="link-container">
                    <input type="text" value="${viewUrl}" readonly id="viewLink">
                    <button class="copy-btn" data-clipboard-target="#viewLink">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
            
            <div class="share-link">
                <label>Ссылка для редактирования (сохраните!):</label>
                <div class="link-container">
                    <input type="text" value="${editUrl}" readonly id="editLink">
                    <button class="copy-btn" data-clipboard-target="#editLink">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
            
            <div class="share-buttons">
                <button class="btn primary" onclick="window.open('${viewUrl}', '_blank')">
                    <i class="fas fa-eye"></i> Открыть
                </button>
                <button class="btn secondary" onclick="navigator.clipboard.writeText('${viewUrl}')">
                    <i class="fas fa-copy"></i> Копировать ссылку
                </button>
                <button class="btn close-modal">
                    <i class="fas fa-times"></i> Закрыть
                </button>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    // Закрытие по клику вне модалки
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('close-modal')) {
            modal.remove();
        }
    });
    
    // Инициализация копирования
    new ClipboardJS('.copy-btn');
}

// Добавляем CSS для модалки
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease;
    }
    
    @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .share-link {
        margin: 20px 0;
    }
    
    .share-link label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #4a5568;
    }
    
    .link-container {
        display: flex;
        gap: 10px;
    }
    
    .link-container input {
        flex: 1;
        padding: 10px 15px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-family: monospace;
        font-size: 0.9rem;
        background: #f7fafc;
    }
    
    .copy-btn {
        padding: 10px 15px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.3s;
    }
    
    .copy-btn:hover {
        background: #5a67d8;
    }
    
    .share-buttons {
        display: flex;
        gap: 10px;
        margin-top: 25px;
    }
`;
document.head.appendChild(modalStyles);
// Адаптация под размер экрана
window.addEventListener('resize', function() {
    // Обновляем предпросмотр устройства при изменении размера окна
    if (currentDevice === 'mobile' || currentDevice === 'tablet') {
        updateDevicePreview();
    }
});

// Проверяем мобильное устройство
function checkMobileDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log('📱 Обнаружено мобильное устройство');
        // Можно добавить специфичные настройки для мобилок
        document.body.classList.add('mobile-device');
    }
}

// Вызываем при загрузке
setTimeout(checkMobileDevice, 500);
});
